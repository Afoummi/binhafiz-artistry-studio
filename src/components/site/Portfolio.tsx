import one from "@/assets/portfolio-1.webp";
import two from "@/assets/portfolio-2.webp";
import three from "@/assets/portfolio-3.webp";
import four from "@/assets/portfolio-4.webp";
import five from "@/assets/portfolio-5.webp";
import six from "@/assets/portfolio-6.webp";

const items = [
  { src: one, title: "Brand Identity Suite", alt: "Brand identity mockup with business cards and letterhead" },
  { src: two, title: "Typographic Poster", alt: "Poster design on a gallery wall" },
  { src: three, title: "Business Card Set", alt: "Embossed business card stack close-up" },
  { src: four, title: "Website UI Concept", alt: "Sleek UI on a laptop screen" },
  { src: five, title: "Album Cover", alt: "Album cover square mockup" },
  { src: six, title: "Packaging Design", alt: "Cosmetic packaging design mockup" },
];

const Portfolio = () => {
  return (
    <section id="portfolio" aria-label="Portfolio" className="py-16 md:py-24">
      <div className="container">
        <header className="max-w-3xl">
          <h2 className="font-display text-3xl md:text-4xl font-bold">Selected Work</h2>
          <p className="mt-3 text-muted-foreground">A snapshot of recent projects across branding, print, packaging, and digital design.</p>
        </header>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((it) => (
            <figure key={it.title} className="group overflow-hidden rounded-lg border border-border bg-card">
              <img src={it.src} alt={it.alt} loading="lazy" className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
              <figcaption className="p-4 text-sm text-muted-foreground">{it.title}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
