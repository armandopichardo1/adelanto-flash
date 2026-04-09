import { UserPlus, Sliders, CheckCircle2, Banknote } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: UserPlus,
    step: "1",
    title: "Tu empresa te activa",
    description: "RRHH registra a tu equipo en la plataforma. Solo necesitas tu cédula para verificar tu identidad.",
  },
  {
    icon: Sliders,
    step: "2",
    title: "Elige cuánto necesitas",
    description: "Desliza el monto que deseas. Ves la comisión de servicio en tiempo real, sin sorpresas.",
  },
  {
    icon: CheckCircle2,
    step: "3",
    title: "Aprobación inmediata",
    description: "Si estás pre-aprobado, confirma con un toque. Sin papeleo, sin filas, sin esperas.",
  },
  {
    icon: Banknote,
    step: "4",
    title: "Dinero en tu cuenta",
    description: "Transferencia directa a tu cuenta bancaria en minutos. Descuento automático en tu próxima nómina.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-10 md:py-16 bg-surface">
      <div className="container mx-auto px-4">
        <motion.div
          className="max-w-xl mb-8 md:mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-primary font-semibold text-sm tracking-wide uppercase mb-3">Proceso simple</p>
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-foreground mb-4">
            4 pasos para acceder a tu salario
          </h2>
          <p className="text-lg text-muted-foreground">
            Diseñado para ser tan fácil como enviar un mensaje. Sin complicaciones bancarias.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              className="relative group"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: index * 0.12, duration: 0.45, ease: "easeOut" }}
            >
              {/* Connector line (desktop) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[calc(50%+32px)] w-[calc(100%-64px)] h-px bg-outline-variant/30" />
              )}

              <div className="relative">
                {/* Step number */}
                <div className="flex items-center gap-4 mb-5">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                      <step.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-foreground text-background text-xs font-bold flex items-center justify-center">
                      {step.step}
                    </span>
                  </div>
                </div>

                <h3 className="font-headline text-lg font-bold text-foreground mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
