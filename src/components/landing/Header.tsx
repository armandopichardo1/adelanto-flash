import { Button } from "@/components/ui/button";
import { Wallet, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const navLinks = [
  { label: "¿Cómo funciona?", href: "/#como-funciona" },
  { label: "Para Empresas", href: "/#empresas" },
  { label: "Calculadora", href: "/#calculadora" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("/#")) {
      const sectionId = href.replace("/#", "");
      const element = document.getElementById(sectionId);
      if (element) {
        e.preventDefault();
        element.scrollIntoView({ behavior: "smooth" });
        setMobileMenuOpen(false);
      }
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-4 mt-3 rounded-2xl bg-surface-container-lowest/70 backdrop-blur-2xl shadow-soft">
        <div className="px-6">
          <div className="flex items-center justify-between h-14 md:h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl gradient-hero flex items-center justify-center">
                <Wallet className="w-4.5 h-4.5 text-primary-foreground" />
              </div>
              <span className="font-headline text-lg font-bold text-foreground tracking-tight">Adelanto Ya</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className="px-4 py-2 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 font-medium transition-all"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" size="sm" className="rounded-xl" asChild>
                <Link to="/login">Iniciar Sesión</Link>
              </Button>
              <Button variant="default" size="sm" className="rounded-xl" asChild>
                <Link to="/login">Solicitar Adelanto</Link>
              </Button>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-xl text-foreground hover:bg-accent/50 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menú"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 pt-2 animate-fade-in">
              <nav className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => scrollToSection(e, link.href)}
                    className="text-muted-foreground hover:text-foreground hover:bg-accent/50 font-medium transition-all py-2.5 px-3 rounded-xl"
                  >
                    {link.label}
                  </a>
                ))}
                <div className="flex flex-col gap-2 pt-3 mt-2" style={{ borderTop: "1px solid hsl(var(--outline-variant) / 0.2)" }}>
                  <Button variant="ghost" className="w-full rounded-xl" asChild>
                    <Link to="/login">Iniciar Sesión</Link>
                  </Button>
                  <Button variant="default" className="w-full rounded-xl" asChild>
                    <Link to="/login">Solicitar Adelanto</Link>
                  </Button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
