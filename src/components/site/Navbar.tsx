import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { href: "#services", label: "Services" },
  { href: "#portfolio", label: "Portfolio" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

export const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur supports-[backdrop-filter]:bg-background/70 border-b border-border/60">
      <nav className={cn("container flex items-center justify-between h-16")}> 
        <a href="#home" className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-gradient-to-r from-[hsl(var(--brand-start))] to-[hsl(var(--brand-end))] text-primary-foreground font-bold">
            BH
          </span>
          <span className="font-display font-semibold tracking-tight">
            Bin Hafiz Graphics
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </a>
          ))}
          <Button asChild variant="outline" size="sm">
            <a href="/auth">Admin</a>
          </Button>
          <Button asChild variant="hero" size="sm">
            <a href="#contact">Hire Me</a>
          </Button>
        </div>

        <button
          className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-md border border-border"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <Menu className="text-foreground" />
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="container py-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="py-1 text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
            <Button asChild variant="outline">
              <a href="/auth" onClick={() => setOpen(false)}>Admin</a>
            </Button>
            <Button asChild variant="hero">
              <a href="#contact" onClick={() => setOpen(false)}>Hire Me</a>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
