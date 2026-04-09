import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Building2, Users, ShieldCheck } from "lucide-react";

const benefits = [
  { icon: Users, text: "Reduce rotación hasta un 32%" },
  { icon: ShieldCheck, text: "Cero riesgo para tu empresa" },
  { icon: Building2, text: "Integración simple con nómina" },
];

export function CTA() {
  return (
    <section className="py-16 md:py-32 bg-surface-container-low">
      <div className="container mx-auto px-4">
        <div className="relative rounded-3xl overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-foreground" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
          <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 rounded-bl-[200px]" />

          <div className="relative px-8 py-16 md:px-16 md:py-20">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left */}
              <div>
                <p className="text-primary font-semibold text-sm tracking-wide uppercase mb-3">Para empresas</p>
                <h2 className="font-headline text-3xl md:text-4xl font-bold text-background mb-4">
                  Ofrece bienestar financiero real a tu equipo
                </h2>
                <p className="text-background/70 text-lg mb-8 leading-relaxed">
                  Más que un beneficio laboral — una herramienta que reduce estrés financiero, mejora productividad y posiciona a tu empresa como empleador de preferencia.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="hero" size="xl" className="rounded-2xl bg-primary text-primary-foreground" asChild>
                    <Link to="/login?type=hr">
                      Registra tu Empresa
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </Button>
                  <Button variant="white" size="lg" className="rounded-2xl" asChild>
                    <Link to="/login">Solicitar Demo</Link>
                  </Button>
                </div>
              </div>

              {/* Right — Benefits */}
              <div className="space-y-5">
                {benefits.map((b) => (
                  <div key={b.text} className="flex items-center gap-4 p-5 rounded-2xl bg-background/5 backdrop-blur-sm">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <b.icon className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-background font-medium text-lg">{b.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
