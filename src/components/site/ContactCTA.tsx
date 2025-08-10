import { Button } from "@/components/ui/button";

const ContactCTA = () => {
  return (
    <section id="contact" aria-label="Contact" className="py-16 md:py-24 relative">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(700px_300px_at_50%_-20%,hsl(var(--brand-end)/0.12),transparent)]" />
      <div className="container relative">
        <div className="rounded-xl border border-border bg-card p-8 md:p-12 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold">Let’s build something memorable</h2>
          <p className="mt-3 text-muted-foreground">Tell me about your idea and timeline. I’ll reply within 24 hours.</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Button asChild variant="hero" size="lg">
              <a href="mailto:hello@binhafiz.graphics?subject=Project Inquiry - Bin Hafiz Graphics">Start a project</a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="#portfolio">Explore work</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactCTA;
