import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import heroImage from "@/assets/hero-worker.jpg";

const trustPoints = [
  "Aprobación en minutos",
  "Sin cargos ocultos",
  "Regulado y transparente",
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-surface min-h-[90vh] flex items-center">
      {/* Subtle organic background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[60%] h-full bg-accent/30 rounded-bl-[120px]" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-secondary-container/10 blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 py-16 md:py-0">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — Copy */}
          <div className="max-w-xl">
            <p className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-xs font-semibold tracking-wide uppercase mb-6">
              Bienestar financiero para tu equipo
            </p>

            <h1 className="font-headline text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold leading-[1.1] text-foreground mb-6">
              Accede a tu salario{" "}
              <span className="relative">
                <span className="text-primary">cuando lo necesites</span>
                <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 300 12" fill="none">
                  <path d="M2 8C50 3 150 2 298 8" stroke="hsl(145 100% 22%)" strokeWidth="3" strokeLinecap="round" opacity="0.3" />
                </svg>
              </span>
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Adelanto Ya permite a los trabajadores dominicanos acceder a su dinero ganado antes del día de pago. Sin trámites, sin esperas — solo tu esfuerzo convertido en liquidez inmediata.
            </p>

            {/* Trust checklist */}
            <ul className="space-y-3 mb-10">
              {trustPoints.map((point) => (
                <li key={point} className="flex items-center gap-3 text-foreground">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="font-medium">{point}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="hero" size="xl" className="rounded-2xl" asChild>
                <Link to="/login">
                  Solicitar Adelanto
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button variant="white" size="lg" className="rounded-2xl" asChild>
                <a href="#como-funciona">¿Cómo funciona?</a>
              </Button>
            </div>
          </div>

          {/* Right — Photo */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-elevated">
              <img
                src={heroImage}
                alt="Trabajadora dominicana accediendo a su adelanto de salario desde su celular"
                width={1280}
                height={960}
                className="w-full h-[280px] md:h-[400px] lg:h-[540px] object-cover object-top"
              />
              {/* Floating stat card */}
              <div className="absolute bottom-6 left-6 bg-surface-container-lowest/90 backdrop-blur-xl rounded-2xl p-4 shadow-elevated">
                <p className="text-xs text-muted-foreground mb-0.5">Adelanto aprobado</p>
                <p className="font-headline text-2xl font-bold text-primary">RD$12,500</p>
                <p className="text-xs text-muted-foreground mt-1">En tu cuenta en 3 minutos →</p>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-2xl bg-accent/60 -z-10" />
            <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-secondary-container/30 -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}
