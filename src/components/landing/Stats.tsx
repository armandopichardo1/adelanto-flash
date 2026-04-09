import workersImage from "@/assets/workers-team.jpg";

const stats = [
  { value: "10,500+", label: "Trabajadores activos" },
  { value: "5", label: "Empresas Zona Franca" },
  { value: "RD$20M+", label: "Desembolsado este mes" },
  { value: "<3 min", label: "Tiempo de aprobación" },
];

export function Stats() {
  return (
    <section className="py-16 md:py-32 bg-surface relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left — Image */}
          <div className="relative rounded-3xl overflow-hidden shadow-card">
            <img
              src={workersImage}
              alt="Equipo de trabajadores dominicanos usando Adelanto Ya"
              width={1280}
              height={640}
              loading="lazy"
              className="w-full h-[360px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <p className="text-background font-headline text-xl font-bold">
                "Antes pedía prestado para las emergencias. Ahora uso mi propio dinero ganado."
              </p>
              <p className="text-background/80 text-sm mt-2">— María Elena, Grupo Corripio ZF</p>
            </div>
          </div>

          {/* Right — Stats */}
          <div>
            <p className="text-primary font-semibold text-sm tracking-wide uppercase mb-3">Números que hablan</p>
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-foreground mb-4">
              Crecimiento real, impacto medible
            </h2>
            <p className="text-muted-foreground mb-10 max-w-md">
              Desde zonas francas hasta oficinas corporativas, Adelanto Ya transforma la relación de los trabajadores con su salario.
            </p>

            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat) => (
                <div key={stat.label} className="p-5 rounded-2xl bg-surface-container-low">
                  <p className="font-headline text-3xl md:text-4xl font-extrabold text-primary mb-1">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
