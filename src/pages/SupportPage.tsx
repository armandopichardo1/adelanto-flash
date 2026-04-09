import { useNavigate } from "react-router-dom";
import { ArrowLeft, MessageCircle, Mail, Phone, ExternalLink } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/shared/BottomNav";

const faqs = [
  { q: "¿Qué es un adelanto de nómina?", a: "Es un acceso anticipado a una porción de tu salario ya trabajado. No es un préstamo — estás accediendo a dinero que ya es tuyo." },
  { q: "¿Cuánto puedo solicitar?", a: "El monto depende de tu antigüedad, salario y el nivel de riesgo configurado por tu empresa. Puedes ver tu cupo disponible en el dashboard." },
  { q: "¿Cómo se descuenta?", a: "El monto total (adelanto + comisión de servicio) se descuenta automáticamente de tu próxima nómina. No hay pagos adicionales." },
  { q: "¿Puedo tener más de un adelanto activo?", a: "Puedes usar la función de Recarga para solicitar más dinero mientras tengas cupo disponible." },
  { q: "¿Se afecta mi historial crediticio?", a: "No. Los adelantos de nómina no se reportan a burós de crédito ya que no son productos de crédito." },
  { q: "¿Qué pasa si me despiden con un adelanto activo?", a: "El saldo pendiente se descuenta de tu liquidación laboral. Tu respaldo laboral siempre cubre el adelanto." },
];

export default function SupportPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface-container-low pb-28">
      <header className="bg-surface-container-lowest sticky top-0 z-50 shadow-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-surface-container-low transition-colors">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <h1 className="font-headline font-bold text-foreground">Soporte y Ayuda</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-lg space-y-6">
        {/* Chat */}
        <div className="bg-gradient-to-br from-primary to-primary-container rounded-3xl p-6 text-primary-foreground">
          <MessageCircle className="w-8 h-8 mb-3" />
          <h3 className="font-headline font-bold text-xl">¿Necesitas ayuda?</h3>
          <p className="text-primary-foreground/70 text-sm mt-1">Nuestro equipo está disponible de lunes a viernes, 8am - 6pm</p>
          <Button variant="secondary" size="lg" className="w-full mt-4">
            Iniciar Chat en Vivo
          </Button>
        </div>

        {/* FAQ */}
        <div className="bg-surface-container-lowest rounded-2xl shadow-card p-5">
          <h3 className="font-headline font-semibold text-foreground mb-4">Preguntas Frecuentes</h3>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-sm text-left font-medium">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Contact */}
        <div className="bg-surface-container-lowest rounded-2xl shadow-card p-5 space-y-4">
          <h3 className="font-headline font-semibold text-foreground">Contacto</h3>
          <ContactRow icon={Mail} label="soporte@adelantoya.com" />
          <ContactRow icon={Phone} label="+1 (809) 555-0100" />
          <ContactRow icon={MessageCircle} label="WhatsApp: +1 (809) 555-0100" />
        </div>

        {/* Legal */}
        <div className="bg-surface-container-lowest rounded-2xl shadow-card p-5 space-y-3">
          <h3 className="font-headline font-semibold text-foreground">Legal</h3>
          <LegalLink label="Términos y Condiciones" />
          <LegalLink label="Política de Privacidad" />
          <LegalLink label="Aviso Legal" />
        </div>
      </main>

      <BottomNav activeTab="profile" />
    </div>
  );
}

function ContactRow({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="flex items-center gap-3 text-sm text-foreground">
      <Icon className="w-4 h-4 text-primary" />
      <span>{label}</span>
    </div>
  );
}

function LegalLink({ label }: { label: string }) {
  return (
    <button className="w-full flex items-center justify-between py-2 text-sm text-foreground hover:text-primary transition-colors">
      {label}
      <ExternalLink className="w-4 h-4 text-muted-foreground" />
    </button>
  );
}
