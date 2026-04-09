import { motion } from "framer-motion";
import workersImage from "@/assets/workers-team.jpg";

const stats = [
  { value: "10,500+", label: "Trabajadores activos" },
  { value: "5", label: "Empresas Zona Franca" },
  { value: "RD$20M+", label: "Desembolsado este mes" },
  { value: "<3 min", label: "Tiempo de aprobación" },
];

export function Stats() {
  return (
    <section className="py-10 md:py-16 bg-surface relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-14 items-center">
          {/* Left — Image */}
          <motion.div
            className="relative rounded-3xl overflow-hidden shadow-card"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <img
              src={workersImage}
              alt="Equipo de trabajadores dominicanos usando Adelanto Ya"
              width={1280}
              height={640}
              loading="lazy"
              className="w-full h-[280px] md:h-[320px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <p className="text-background font-headline text-xl font-bold">
                "Antes esperaba quincena para resolver emergencias. Ahora accedo a mi propio dinero ganado."
              </p>
              <p className="text-background/80 text-sm mt-2">— María Elena, Grupo Corripio ZF</p>
            </div>
          </motion.div>

          {/* Right — Stats */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <p className="text-primary font-semibold text-sm tracking-wide uppercase mb-3">Números que hablan</p>
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-foreground mb-4">
              Crecimiento real, impacto medible
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              Desde zonas francas hasta oficinas corporativas, Adelanto Ya transforma la relación de los trabajadores con su salario.
            </p>

            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="p-5 rounded-2xl bg-surface-container-low"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
                >
                  <p className="font-headline text-3xl md:text-4xl font-extrabold text-primary mb-1">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
