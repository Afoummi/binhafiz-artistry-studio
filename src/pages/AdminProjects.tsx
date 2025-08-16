import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";

const AdminProjects = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [files, setFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);
  const [sessionUserId, setSessionUserId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    document.title = "Add Project | Bin Hafiz Graphics";
    const canonical = document.querySelector("link[rel='canonical']") || document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    canonical.setAttribute("href", `${window.location.origin}/admin/projects`);
    document.head.appendChild(canonical);

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSessionUserId(session?.user?.id ?? null);
      if (!session?.user) {
        navigate("/auth", { replace: true });
      }
    });

    supabase.auth.getSession().then(({ data }) => {
      const uid = data.session?.user?.id ?? null;
      setSessionUserId(uid);
      if (!uid) navigate("/auth", { replace: true });
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const canSubmit = useMemo(() => {
    return !!sessionUserId && !!title && files && files.length > 0;
  }, [sessionUserId, title, files]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setGithubUrl("");
    setLiveUrl("");
    setIsPublished(false);
    setFiles(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionUserId || !files || files.length === 0) return;

    setUploading(true);
    try {
      // 1) Create project row
      const { data: projectData, error: projectError } = await supabase
        .from("projects")
        .insert([
          {
            user_id: sessionUserId,
            title,
            description,
            github_url: githubUrl || null,
            live_url: liveUrl || null,
            is_published: isPublished,
          },
        ])
        .select("id")
        .maybeSingle();

      if (projectError || !projectData) throw projectError || new Error("Failed to create project");

      const projectId = projectData.id as string;

      // 2) Upload files and insert image rows
      const uploads = Array.from(files).map(async (file, idx) => {
        const ext = file.name.split(".").pop();
        const path = `${sessionUserId}/${projectId}/${Date.now()}-${idx}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from("portfolio")
          .upload(path, file, { upsert: false });
        if (uploadError) throw uploadError;

        const { data: pub } = supabase.storage.from("portfolio").getPublicUrl(path);

        const { error: imgError } = await supabase
          .from("project_images")
          .insert([
            {
              project_id: projectId,
              user_id: sessionUserId,
              path,
              alt: `${title} image ${idx + 1}`,
              position: idx,
            },
          ]);
        if (imgError) throw imgError;

        return pub.publicUrl;
      });

      await Promise.all(uploads);

      toast({ title: "Project created", description: "Your project and images were uploaded." });
      resetForm();
    } catch (err: any) {
      console.error(err);
      toast({ title: "Error", description: err.message || "Could not create project", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="container py-16">
      <section className="mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Add Project</CardTitle>
            <CardDescription>Upload a new project with multiple images.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-6" aria-label="Create project form">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="github">GitHub URL</Label>
                  <Input id="github" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} placeholder="https://github.com/..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="live">Live URL</Label>
                  <Input id="live" value={liveUrl} onChange={(e) => setLiveUrl(e.target.value)} placeholder="https://..." />
                </div>
              </div>

              <div className="flex items-center justify-between border border-border rounded-md p-3">
                <div className="space-y-1">
                  <Label htmlFor="publish">Publish immediately</Label>
                  <p className="text-xs text-muted-foreground">If enabled, this project becomes visible on your site.</p>
                </div>
                <Switch id="publish" checked={isPublished} onCheckedChange={setIsPublished} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="files">Images *</Label>
                <Input id="files" ref={fileInputRef} type="file" accept="image/*" multiple onChange={onFileChange} />
                <p className="text-xs text-muted-foreground">Upload multiple images. They will be stored securely.</p>
              </div>

              <Button type="submit" className="w-full" disabled={!canSubmit || uploading}>
                {uploading ? "Uploading..." : "Create Project"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </main>
  );
};

export default AdminProjects;
