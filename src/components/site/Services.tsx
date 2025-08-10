import { Layers, Palette, PenTool, Sparkles, MonitorSmartphone, Printer } from "lucide-react";

const services = [
  { icon: Palette, title: "Brand Identity", desc: "Naming, color systems, typography, and brand guidelines." },
  { icon: PenTool, title: "Logo Design", desc: "Distinctive, scalable marks built to last." },
  { icon: Layers, title: "Packaging", desc: "Shelf-ready packaging with impact and clarity." },
  { icon: MonitorSmartphone, title: "UI Visuals", desc: "Landing pages and app visuals that convert." },
  { icon: Printer, title: "Print & Posters", desc: "Editorial layouts, posters, and marketing collateral." },
  { icon: Sparkles, title: "Social Kits", desc: "Templates and asset packs for social media." },
];

const Services = () => {
  return (
    <section id="services" aria-label="Services" className="py-16 md:py-24">
      <div className="container">
        <header className="max-w-3xl">
          <h2 className="font-display text-3xl md:text-4xl font-bold">Services</h2>
          <p className="mt-3 text-muted-foreground">A full-suite of graphic design capabilities to support your brand across print and digital touchpoints.</p>
        </header>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(({ icon: Icon, title, desc }) => (
            <article key={title} className="group relative rounded-lg border border-border bg-card p-6 transition-colors hover:bg-accent/40">
              <div className="flex items-center gap-4">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-gradient-to-r from-[hsl(var(--brand-start))] to-[hsl(var(--brand-end))] text-primary-foreground">
                  <Icon className="size-5" />
                </span>
                <h3 className="font-semibold">{title}</h3>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
