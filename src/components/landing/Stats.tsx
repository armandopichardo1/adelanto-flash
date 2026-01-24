const stats = [
  { value: "RD$50M+", label: "Adelantado a empleados" },
  { value: "15K+", label: "Usuarios activos" },
  { value: "98%", label: "Tasa de satisfacción" },
  { value: "<3min", label: "Tiempo de aprobación" },
];

export function Stats() {
  return (
    <section className="py-16 md:py-20 gradient-trust">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <div 
              key={stat.label}
              className="text-center animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-2">
                {stat.value}
              </p>
              <p className="text-primary-foreground/80 text-sm md:text-base">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
