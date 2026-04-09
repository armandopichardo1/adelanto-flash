import { Wallet, TrendingUp, Building2, Shield, Clock, Heart } from "lucide-react";

const features = [
  {
    icon: Wallet,
    title: "Salario On-Demand",
    description: "Accede hasta el 80% de tu salario ganado antes del día de pago. Tu esfuerzo, tu dinero, tu decisión.",
    accent: "bg-primary/10 text-primary",
  },
  {
    icon: Clock,
    title: "Adelanto en Minutos",
    description: "Solicita y recibe en tu cuenta bancaria en menos de 3 minutos. Proceso 100% digital.",
    accent: "bg-secondary/10 text-secondary",
  },
  {
    icon: Shield,
    title: "Respaldado por tu Trabajo",
    description: "Tu adelanto está respaldado por tu valor laboral acumulado. Sin garantías adicionales.",
    accent: "bg-primary/10 text-primary",
  },
  {
    icon: TrendingUp,
    title: "Construye tu Perfil",
    description: "Cada adelanto pagado a tiempo mejora tu Dinero Score. Desbloquea mejores condiciones progresivamente.",
    accent: "bg-secondary/10 text-secondary",
  },
  {
    icon: Building2,
    title: "Beneficio Empresarial",
    description: "Ofrece bienestar financiero real a tus empleados. Mejora retención, reduce ausentismo y aumenta productividad.",
    accent: "bg-primary/10 text-primary",
  },
  {
    icon: Heart,
    title: "Impacto Social Real",
    description: "Ayuda a miles de familias dominicanas a evitar prestamistas informales. Inclusión financiera con dignidad.",
    accent: "bg-secondary/10 text-secondary",
  },
];

export function Features() {
  return (
    <section className="py-24 md:py-32 bg-surface-container-low">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <p className="text-primary font-semibold text-sm tracking-wide uppercase mb-3">¿Por qué Adelanto Ya?</p>
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-foreground mb-4">
            Libertad financiera diseñada para ti
          </h2>
          <p className="text-lg text-muted-foreground">
            No somos un banco, no somos un prestamista. Somos el puente entre tu trabajo y tu dinero.
          </p>
        </div>

        {/* Features grid — asymmetric layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group p-7 rounded-2xl bg-surface-container-lowest hover:shadow-elevated transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${feature.accent} mb-5 group-hover:scale-105 transition-transform`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="font-headline text-lg font-bold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
