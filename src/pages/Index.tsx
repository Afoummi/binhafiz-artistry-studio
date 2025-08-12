import Navbar from "@/components/site/Navbar";
import Hero from "@/components/site/Hero";
import Services from "@/components/site/Services";
import Portfolio from "@/components/site/Portfolio";
import Testimonials from "@/components/site/Testimonials";
import ContactForm from "@/components/site/ContactForm";
import ContactCTA from "@/components/site/ContactCTA";
import Footer from "@/components/site/Footer";
import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    document.title = "Bin Hafiz Graphics | Graphic Design Studio";

    // Ensure absolute canonical URL
    const canonicalHref = window.location.origin + window.location.pathname;
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', canonicalHref);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <section id="about" aria-label="About" className="py-16 md:py-24">
          <div className="container grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold">About</h2>
              <p className="mt-3 text-muted-foreground">I’m Muhammad Bashir Hafizu — a multidisciplinary graphic designer focused on building brands with clarity and character. My approach blends strategic thinking with expressive visuals to deliver work that resonates and performs.</p>
            </div>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>• 5+ years in branding and identity systems</li>
              <li>• Print production experience and prepress workflows</li>
              <li>• Digital-first assets: UI visuals, social kits, and motion-ready layouts</li>
            </ul>
          </div>
        </section>
        <Services />
        <Portfolio />
        <Testimonials />
        <ContactForm />
        <ContactCTA />
      </main>
      <Footer />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            name: "Bin Hafiz Graphics",
            url: "/",
            description: "Premium branding, logos, and visual design by Bin Hafiz Graphics.",
            areaServed: "Global",
            sameAs: [],
            brand: {
              "@type": "Brand",
              name: "Bin Hafiz Graphics"
            }
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "What services do you offer?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Brand identity, logo design, print assets, and digital visual design."
                }
              },
              {
                "@type": "Question",
                name: "How soon can we start?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "I typically respond within 24 hours and can start within 1–2 weeks depending on availability."
                }
              }
            ]
          }),
        }}
      />
    </div>
  );
};

export default Index;
