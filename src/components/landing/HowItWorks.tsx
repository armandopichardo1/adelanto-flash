import { UserPlus, Sliders, CheckCircle2, Banknote } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Regístrate",
    description: "Tu empresa te da acceso. Solo necesitas tu cédula y verificar tu identidad.",
  },
  {
    icon: Sliders,
    step: "02",
    title: "Elige tu Monto",
    description: "Desliza para seleccionar cuánto necesitas. Ves la comisión en tiempo real.",
  },
  {
    icon: CheckCircle2,
    step: "03",
    title: "Aprobación Instantánea",
    description: "Si estás pre-aprobado, solo confirma con un clic. Sin papeleo.",
  },
  {
    icon: Banknote,
    step: "04",
    title: "Recibe tu Dinero",
    description: "Transferencia directa a tu cuenta bancaria en minutos.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 md:py-28 bg-surface">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-4">
            Proceso Simple
          </span>
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-foreground mb-4">
            ¿Cómo Funciona?
          </h2>
          <p className="text-lg text-muted-foreground">
            En 4 pasos simples, accede a tu salario ganado cuando lo necesites.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection line (desktop) */}
          <div className="hidden lg:block absolute top-24 left-1/2 -translate-x-1/2 w-3/4 h-0.5 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6">
            {steps.map((step, index) => (
              <StepCard key={step.step} {...step} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StepCard({
  icon: Icon,
  step,
  title,
  description,
  index,
}: {
  icon: typeof UserPlus;
  step: string;
  title: string;
  description: string;
  index: number;
}) {
  return (
    <div 
      className="relative text-center animate-fade-in"
      style={{ animationDelay: `${index * 0.15}s` }}
    >
      {/* Step number badge */}
      <div className="relative inline-flex mb-6">
        <div className="w-20 h-20 rounded-3xl gradient-hero flex items-center justify-center shadow-button">
          <Icon className="w-8 h-8 text-primary-foreground" />
        </div>
        <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-secondary text-secondary-foreground text-sm font-bold flex items-center justify-center shadow-card">
          {step}
        </span>
      </div>

      <h3 className="font-headline text-xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
