import { Link } from "react-router-dom";
import logoWhite from "@/assets/logo-adelanto-ya-white.png";

const footerLinks = {
  producto: [
    { label: "¿Cómo funciona?", href: "/#como-funciona" },
    { label: "Calculadora", href: "/#calculadora" },
    { label: "Para Empresas", href: "/#empresas" },
    { label: "Preguntas Frecuentes", href: "#" },
  ],
  legal: [
    { label: "Términos de Servicio", href: "#" },
    { label: "Política de Privacidad", href: "#" },
    { label: "Contratos", href: "#" },
  ],
  empresa: [
    { label: "Sobre Nosotros", href: "#" },
    { label: "Contacto", href: "#" },
    { label: "Empleo", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-foreground">
      <div className="container mx-auto px-4 py-10 md:py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center mb-5">
              <img src={logoWhite} alt="Adelanto Ya" className="h-8 w-auto" loading="lazy" />
            </Link>
            <p className="text-background/50 text-sm leading-relaxed mb-6">
              Tu salario ganado, cuando lo necesites. Libertad financiera para los trabajadores dominicanos.
            </p>
          </div>

          {/* Links columns */}
          <div>
            <h4 className="font-headline font-bold text-background text-sm mb-4 uppercase tracking-wide">Producto</h4>
            <ul className="space-y-3">
              {footerLinks.producto.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-background/40 hover:text-background text-sm transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-headline font-bold text-background text-sm mb-4 uppercase tracking-wide">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-background/40 hover:text-background text-sm transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-headline font-bold text-background text-sm mb-4 uppercase tracking-wide">Empresa</h4>
            <ul className="space-y-3">
              {footerLinks.empresa.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-background/40 hover:text-background text-sm transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8" style={{ borderTop: "1px solid hsl(var(--background) / 0.1)" }}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-background/30 text-xs">
              © 2024 Adelanto Ya SRL. Todos los derechos reservados.
            </p>
            <p className="text-background/30 text-xs text-center md:text-right max-w-lg">
              Servicio de adelanto de nómina respaldado por el valor laboral acumulado según el Código Laboral de la República Dominicana.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
