import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignIn, setIsSignIn] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    document.title = isSignIn ? "Login | Bin Hafiz Graphics" : "Sign Up | Bin Hafiz Graphics";
    const canonical = document.querySelector("link[rel='canonical']") || document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    canonical.setAttribute("href", `${window.location.origin}/auth`);
    document.head.appendChild(canonical);

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        navigate("/admin/projects", { replace: true });
      }
    });

    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        navigate("/admin/projects", { replace: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [isSignIn, navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignIn) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast({ title: "Logged in", description: "Welcome back!" });
      } else {
        const redirectUrl = `${window.location.origin}/`;
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: redirectUrl }
        });
        if (error) throw error;
        toast({ title: "Check your email", description: "Confirm your email to finish sign up." });
      }
    } catch (err: any) {
      toast({ title: "Authentication error", description: err.message || "Something went wrong", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container py-16">
      <section className="mx-auto max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{isSignIn ? "Login" : "Create an account"}</CardTitle>
            <CardDescription>
              {isSignIn ? "Login to upload your projects" : "Sign up to manage your portfolio"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuth} className="space-y-4" aria-label={isSignIn ? "Login form" : "Sign up form"}>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Please wait..." : isSignIn ? "Login" : "Sign Up"}
              </Button>
            </form>
            <div className="mt-4 text-center text-sm text-muted-foreground">
              {isSignIn ? (
                <button className="underline underline-offset-4" onClick={() => setIsSignIn(false)} aria-label="Switch to sign up">
                  Need an account? Sign up
                </button>
              ) : (
                <button className="underline underline-offset-4" onClick={() => setIsSignIn(true)} aria-label="Switch to login">
                  Have an account? Login
                </button>
              )}
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
};

export default Auth;
