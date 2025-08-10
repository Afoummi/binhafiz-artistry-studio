const Testimonials = () => {
  return (
    <section aria-label="Testimonials" className="py-16 md:py-24 bg-accent/40">
      <div className="container">
        <header className="max-w-3xl">
          <h2 className="font-display text-3xl md:text-4xl font-bold">Client Feedback</h2>
          <p className="mt-3 text-muted-foreground">What collaborators and clients say about working together.</p>
        </header>
        <div className="mt-10 grid md:grid-cols-3 gap-6">
          {[
            { q: "Elevated our brand beyond expectations.", a: "Ayesha, Founder" },
            { q: "Fast, thoughtful, and impeccably crafted.", a: "Usman, Product Lead" },
            { q: "A strong partner from concept to final delivery.", a: "Sara, Marketing" },
          ].map((t) => (
            <blockquote key={t.q} className="rounded-lg border border-border bg-card p-6">
              <p className="text-sm">“{t.q}”</p>
              <footer className="mt-4 text-xs text-muted-foreground">— {t.a}</footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
