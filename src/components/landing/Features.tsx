import { Wallet, TrendingUp, Building2, Shield, Clock, Users } from "lucide-react";

const features = [
  {
    icon: Wallet,
    title: "Salario On-Demand",
    description: "Accede hasta el 80% de tu salario ganado antes del día de pago. Sin esperas.",
  },
  {
    icon: Clock,
    title: "Adelanto Flash",
    description: "Solicita y recibe tu adelanto en minutos, no días. Proceso 100% digital.",
  },
  {
    icon: Shield,
    title: "Respaldado por tu Trabajo",
    description: "Tu adelanto está respaldado por tus prestaciones laborales. Cero riesgo.",
  },
  {
    icon: TrendingUp,
    title: "Mejora tu Historial",
    description: "Cada adelanto pagado a tiempo construye tu perfil. Desbloquea mejores límites.",
  },
  {
    icon: Building2,
    title: "Para Empresas",
    description: "Ofrece bienestar financiero a tus empleados. Retención y productividad mejorada.",
  },
  {
    icon: Users,
    title: "Comunidad Adelanto Ya",
    description: "Únete a miles de dominicanos que ya disfrutan de libertad financiera.",
  },
];

export function Features() {
  return (
    <section className="py-20 md:py-28 bg-surface-container-low">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-foreground mb-4">
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
  delay,
}: {
  icon: typeof Wallet;
  title: string;
  description: string;
  delay: number;
}) {
  return (
    <div 
      className="group p-6 rounded-2xl bg-surface-container-lowest shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 animate-fade-in"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-accent text-primary mb-4 group-hover:scale-110 transition-transform">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="font-headline text-xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
