import { Github, Instagram, Linkedin, Mail, MessageCircle } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border">
      <div className="container py-10 flex flex-col md:flex-row gap-6 items-center justify-between">
        <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Bin Hafiz Graphics • All rights reserved.</p>
        <nav className="flex items-center gap-4">
          <a href="#services" className="text-sm text-muted-foreground hover:text-foreground">Services</a>
          <a href="#portfolio" className="text-sm text-muted-foreground hover:text-foreground">Portfolio</a>
          <a href="#about" className="text-sm text-muted-foreground hover:text-foreground">About</a>
          <a href="#contact" className="text-sm text-muted-foreground hover:text-foreground">Contact</a>
        </nav>
        <div className="flex items-center gap-3">
          <a aria-label="Email" href="mailto:yayabashiru2001@gmail.com" className="p-2 rounded-md border border-border hover:bg-accent/50"><Mail className="size-4" /></a>
          <a aria-label="WhatsApp" href="https://wa.me/2349044038295" target="_blank" rel="noopener" className="p-2 rounded-md border border-border hover:bg-accent/50"><MessageCircle className="size-4" /></a>
          <a aria-label="Instagram" href="#" className="p-2 rounded-md border border-border hover:bg-accent/50"><Instagram className="size-4" /></a>
          <a aria-label="LinkedIn" href="#" className="p-2 rounded-md border border-border hover:bg-accent/50"><Linkedin className="size-4" /></a>
          <a aria-label="GitHub" href="#" className="p-2 rounded-md border border-border hover:bg-accent/50"><Github className="size-4" /></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
