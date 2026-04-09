import { Wallet } from "lucide-react";

const footerLinks = {
  producto: [
    { label: "¿Cómo funciona?", href: "#" },
    { label: "Calculadora", href: "#" },
    { label: "Para Empresas", href: "#" },
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
    <footer className="bg-on-surface text-surface-container-lowest">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center">
                <Wallet className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-headline text-xl font-bold">Adelanto Ya</span>
            </div>
            <p className="text-surface-container-high text-sm mb-4">
              Tu salario, cuando lo necesites. Libertad financiera para trabajadores dominicanos.
            </p>
            <p className="text-surface-container text-xs">
              © 2024 Adelanto Ya SRL. Todos los derechos reservados.
            </p>
          </div>

          {/* Links columns */}
          <div>
            <h4 className="font-headline font-semibold mb-4">Producto</h4>
            <ul className="space-y-2">
              {footerLinks.producto.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href}
                    className="text-surface-container-high hover:text-surface-container-lowest text-sm transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-headline font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href}
                    className="text-surface-container-high hover:text-surface-container-lowest text-sm transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-headline font-semibold mb-4">Empresa</h4>
            <ul className="space-y-2">
              {footerLinks.empresa.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href}
                    className="text-surface-container-high hover:text-surface-container-lowest text-sm transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8">
          <p className="text-center text-surface-container text-xs">
            Adelanto Ya es un servicio de adelanto de nómina. Tu salario ganado, respaldado por tu valor laboral acumulado según el Código Laboral de la República Dominicana.
          </p>
        </div>
      </div>
    </footer>
  );
}
