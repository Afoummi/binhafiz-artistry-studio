import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Trash2, Upload, LogOut, Eye, EyeOff } from "lucide-react";
import type { User } from "@supabase/supabase-js";

type Project = {
  id: string;
  title: string;
  description: string;
  github_url: string;
  live_url: string;
  is_published: boolean;
  created_at: string;
};

type ProjectImage = {
  id: string;
  project_id: string;
  path: string;
  alt: string;
  position: number;
};

const AdminProjects = () => {
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectImages, setProjectImages] = useState<ProjectImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    github_url: "",
    live_url: "",
    is_published: false,
  });
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    document.title = "Admin Projects | Bin Hafiz Graphics";
    const canonical = document.querySelector("link[rel='canonical']") || document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    canonical.setAttribute("href", `${window.location.origin}/admin/projects`);
    document.head.appendChild(canonical);

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session?.user) {
        navigate("/auth", { replace: true });
      } else {
        setUser(session.user);
      }
    });

    supabase.auth.getSession().then(({ data }) => {
      if (!data.session?.user) {
        navigate("/auth", { replace: true });
      } else {
        setUser(data.session.user);
        loadProjects();
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const { data: projectsData, error: projectsError } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (projectsError) throw projectsError;

      const { data: imagesData, error: imagesError } = await supabase
        .from("project_images")
        .select("*")
        .order("position");

      if (imagesError) throw imagesError;

      setProjects(projectsData || []);
      setProjectImages(imagesData || []);
    } catch (err: any) {
      toast({ title: "Error loading projects", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setUploading(true);
    try {
      // Insert project
      const { data: project, error: projectError } = await supabase
        .from("projects")
        .insert([{ ...formData, user_id: user.id }])
        .select()
        .single();

      if (projectError) throw projectError;

      // Upload images if any
      if (selectedFiles && selectedFiles.length > 0) {
        for (let i = 0; i < selectedFiles.length; i++) {
          const file = selectedFiles[i];
          const fileExt = file.name.split('.').pop();
          const fileName = `${user.id}/${project.id}-${i}.${fileExt}`;

          const { error: uploadError } = await supabase.storage
            .from("portfolio")
            .upload(fileName, file);

          if (uploadError) throw uploadError;

          // Insert image record
          const { error: imageError } = await supabase
            .from("project_images")
            .insert([{
              project_id: project.id,
              user_id: user.id,
              path: fileName,
              alt: `${formData.title} image ${i + 1}`,
              position: i,
            }]);

          if (imageError) throw imageError;
        }
      }

      toast({ title: "Success", description: "Project uploaded successfully!" });
      setFormData({ title: "", description: "", github_url: "", live_url: "", is_published: false });
      setSelectedFiles(null);
      loadProjects();
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const togglePublished = async (projectId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("projects")
        .update({ is_published: !currentStatus })
        .eq("id", projectId);

      if (error) throw error;
      toast({ title: "Updated", description: `Project ${!currentStatus ? "published" : "unpublished"}` });
      loadProjects();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const deleteProject = async (projectId: string) => {
    if (!confirm("Delete this project? This cannot be undone.")) return;

    try {
      // Delete associated images from storage
      const imagesToDelete = projectImages.filter(img => img.project_id === projectId);
      for (const image of imagesToDelete) {
        await supabase.storage.from("portfolio").remove([image.path]);
      }

      // Delete project (cascade will handle project_images)
      const { error } = await supabase.from("projects").delete().eq("id", projectId);
      if (error) throw error;

      toast({ title: "Deleted", description: "Project deleted successfully." });
      loadProjects();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const getImageUrl = (path: string) => {
    const { data } = supabase.storage.from("portfolio").getPublicUrl(path);
    return data.publicUrl;
  };

  if (loading) return <div className="container py-16">Loading...</div>;

  return (
    <main className="container py-8">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Project Management</h1>
          <p className="text-muted-foreground">Upload and manage your portfolio projects</p>
        </div>
        <Button onClick={handleLogout} variant="outline" size="sm">
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </header>

      {/* Upload Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Add New Project</CardTitle>
          <CardDescription>Upload a new project with images</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Project Title</Label>
                <Input
                  id="title"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="My Awesome Project"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="github_url">GitHub URL (optional)</Label>
                <Input
                  id="github_url"
                  type="url"
                  value={formData.github_url}
                  onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                  placeholder="https://github.com/..."
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of your project..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="live_url">Live URL (optional)</Label>
              <Input
                id="live_url"
                type="url"
                value={formData.live_url}
                onChange={(e) => setFormData({ ...formData, live_url: e.target.value })}
                placeholder="https://myproject.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="images">Project Images</Label>
              <Input
                id="images"
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setSelectedFiles(e.target.files)}
              />
              <p className="text-sm text-muted-foreground">Select multiple images to showcase your project</p>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="published"
                checked={formData.is_published}
                onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
              />
              <Label htmlFor="published">Publish immediately</Label>
            </div>
            <Button type="submit" disabled={uploading}>
              {uploading ? "Uploading..." : <><Upload className="w-4 h-4 mr-2" />Upload Project</>}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Projects List */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Your Projects ({projects.length})</h2>
        {projects.length === 0 ? (
          <p className="text-muted-foreground">No projects yet. Upload your first project above!</p>
        ) : (
          projects.map((project) => {
            const images = projectImages.filter(img => img.project_id === project.id);
            return (
              <Card key={project.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold">{project.title}</h3>
                      <p className="text-muted-foreground">{project.description}</p>
                      <div className="flex gap-4 mt-2 text-sm">
                        {project.github_url && (
                          <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                            GitHub
                          </a>
                        )}
                        {project.live_url && (
                          <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                            Live Site
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => togglePublished(project.id, project.is_published)}
                        variant="outline"
                        size="sm"
                      >
                        {project.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button
                        onClick={() => deleteProject(project.id)}
                        variant="destructive"
                        size="sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  {images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {images.map((image) => (
                        <img
                          key={image.id}
                          src={getImageUrl(image.path)}
                          alt={image.alt}
                          className="aspect-square object-cover rounded-lg border"
                        />
                      ))}
                    </div>
                  )}
                  <div className="mt-4 text-sm text-muted-foreground">
                    Status: <span className={project.is_published ? "text-green-600" : "text-yellow-600"}>
                      {project.is_published ? "Published" : "Draft"}
                    </span>
                    {" • "}
                    Created: {new Date(project.created_at).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </main>
  );
};

export default AdminProjects;