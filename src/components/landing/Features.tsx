import { Wallet, TrendingUp, Building2, Shield, Clock, Users } from "lucide-react";

const features = [
  {
    icon: Wallet,
    title: "Salario On-Demand",
    description: "Accede hasta el 80% de tu salario ganado antes del día de pago. Sin esperas.",
    color: "text-primary",
    bg: "bg-accent",
  },
  {
    icon: Clock,
    title: "Adelanto Flash",
    description: "Solicita y recibe tu adelanto en minutos, no días. Proceso 100% digital.",
    color: "text-primary",
    bg: "bg-accent",
  },
  {
    icon: Shield,
    title: "Respaldado por tu Trabajo",
    description: "Tu adelanto está respaldado por tus prestaciones laborales. Cero riesgo.",
    color: "text-secondary",
    bg: "bg-trust-light",
  },
  {
    icon: TrendingUp,
    title: "Mejora tu Historial",
    description: "Cada adelanto pagado a tiempo construye tu perfil. Desbloquea mejores límites.",
    color: "text-primary",
    bg: "bg-accent",
  },
  {
    icon: Building2,
    title: "Para Empresas",
    description: "Ofrece bienestar financiero a tus empleados. Retención y productividad mejorada.",
    color: "text-secondary",
    bg: "bg-trust-light",
  },
  {
    icon: Users,
    title: "Comunidad Adelanto Ya",
    description: "Únete a miles de dominicanos que ya disfrutan de libertad financiera.",
    color: "text-primary",
    bg: "bg-accent",
  },
];

export function Features() {
  return (
    <section className="py-20 md:py-28 bg-muted/50">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Libertad Financiera,{" "}
            <span className="text-primary">Sin Complicaciones</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Diseñado para trabajadores dominicanos que merecen acceder a su dinero ganado cuando lo necesitan.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <FeatureCard 
              key={feature.title} 
              {...feature} 
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  color,
  bg,
  delay,
}: {
  icon: typeof Wallet;
  title: string;
  description: string;
  color: string;
  bg: string;
  delay: number;
}) {
  return (
    <div 
      className="group p-6 rounded-2xl bg-card shadow-soft hover:shadow-card transition-all duration-300 hover:-translate-y-1 animate-fade-in"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${bg} ${color} mb-4 group-hover:scale-110 transition-transform`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
