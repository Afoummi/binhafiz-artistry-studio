import heroImage from "@/assets/hero-studio.jpg";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section id="home" aria-label="Bin Hafiz Graphics hero" className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_600px_at_10%_-20%,hsl(var(--brand-end)/0.12),transparent),radial-gradient(1000px_500px_at_90%_10%,hsl(var(--brand-start)/0.12),transparent)]" />
      <div className="container grid md:grid-cols-2 gap-10 items-center py-16 md:py-24">
        <div>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight bg-gradient-to-r from-[hsl(var(--brand-start))] via-[hsl(var(--brand-end))] to-[hsl(var(--brand-start))] bg-clip-text text-transparent animate-gradient-x bg-[length:200%_auto]">
            Crafting Bold Visual Identities
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-prose">
            I help brands stand out through strategic design—logos, branding systems, packaging, posters, and digital experiences.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button asChild variant="hero" size="lg">
              <a href="#portfolio" aria-label="View portfolio">View Portfolio</a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="#contact" aria-label="Contact Bin Hafiz">Get in touch</a>
            </Button>
          </div>
          <div className="mt-6 text-sm text-muted-foreground">
            Available for freelance projects and collaborations.
          </div>
        </div>
        <div className="relative">
          <div aria-hidden className="absolute -inset-8 md:-inset-10 rounded-xl blur-3xl bg-gradient-to-r from-[hsl(var(--brand-start)/0.25)] to-[hsl(var(--brand-end)/0.25)] animate-pulse" />
          <img
            src={heroImage}
            alt="Graphic design studio desk with color swatches, tablet, and posters"
            className="relative rounded-lg border border-border shadow-[var(--shadow-elegant)] md:hover:rotate-[-1.5deg] transition-transform duration-500"
            loading="eager"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
