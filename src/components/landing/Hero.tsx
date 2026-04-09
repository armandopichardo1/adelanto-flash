import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, Zap, Clock } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-surface">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] rounded-full bg-accent opacity-50 blur-3xl" />
        <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-secondary-container/20 opacity-30 blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 pt-20 pb-24 md:pt-32 md:pb-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-8 animate-fade-in">
            <Zap className="w-4 h-4" />
            <span>Adelanto Flash • Sin trámites complicados</span>
          </div>

          {/* Headline */}
          <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground mb-6 animate-slide-up">
            Tu Salario,{" "}
            <span className="text-primary">On-Demand</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Accede a tu dinero ganado cuando lo necesites. 
            <span className="text-foreground font-medium"> Sin préstamos, sin deudas</span> — solo tu salario adelantado.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Button variant="hero" size="xl" asChild>
              <Link to="/login">
                Solicitar Adelanto
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button variant="white" size="lg" asChild>
              <a href="#como-funciona">¿Cómo funciona?</a>
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <TrustBadge 
              icon={<Clock className="w-5 h-5" />}
              title="En Minutos"
              description="Aprobación instantánea"
            />
            <TrustBadge 
              icon={<Shield className="w-5 h-5" />}
              title="100% Seguro"
              description="Regulado y transparente"
            />
            <TrustBadge 
              icon={<Zap className="w-5 h-5" />}
              title="Sin Intereses"
              description="Solo comisión de servicio"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustBadge({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-2xl bg-surface-container-lowest shadow-card">
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-accent text-primary">
        {icon}
      </div>
      <div className="text-left">
        <p className="font-headline font-semibold text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
