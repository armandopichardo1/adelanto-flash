import { useState, useMemo } from "react";
import { Slider } from "@/components/ui/slider";
import {
  calculateAdvanceLimit,
  calculateAdvanceDetails,
  formatDOP,
  getFeeLabel,
  DEFAULT_FEE_CONFIG,
} from "@/lib/advance-calculator";
import { Shield, TrendingUp, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function LoanCalculator() {
  const [salary, setSalary] = useState(45000);
  const [tenure, setTenure] = useState(2);

  const advanceLimit = useMemo(() => calculateAdvanceLimit({
    monthlySalary: salary,
    tenureYears: tenure,
    riskMode: 'conservative',
  }), [salary, tenure]);

  const advanceDetails = useMemo(() => calculateAdvanceDetails(advanceLimit.maxAdvanceAmount, salary), [advanceLimit.maxAdvanceAmount, salary]);

  const feeLabel = getFeeLabel(DEFAULT_FEE_CONFIG);

  return (
    <section className="py-24 md:py-32 bg-surface-container-low">
      <div className="container mx-auto px-4">
        <div className="max-w-xl mb-12">
          <p className="text-primary font-semibold text-sm tracking-wide uppercase mb-3">Calculadora</p>
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-foreground mb-4">
            ¿Cuánto puedes solicitar?
          </h2>
          <p className="text-lg text-muted-foreground">
            Mueve los controles para ver tu límite estimado basado en salario y antigüedad.
          </p>
        </div>

        <div className="max-w-4xl">
          <div className="bg-surface-container-lowest rounded-3xl shadow-card overflow-hidden">
            <div className="grid md:grid-cols-5 gap-0">
              {/* Inputs — 3 cols */}
              <div className="md:col-span-3 p-8 md:p-10 space-y-10">
                {/* Salary */}
                <div>
                  <div className="flex items-baseline justify-between mb-5">
                    <label className="text-sm font-medium text-muted-foreground">Salario Mensual</label>
                    <span className="font-headline text-3xl font-bold text-foreground">{formatDOP(salary)}</span>
                  </div>
                  <Slider
                    value={[salary]}
                    onValueChange={([value]) => setSalary(value)}
                    min={15000}
                    max={150000}
                    step={5000}
                    className="w-full"
                  />
                  <div className="flex justify-between mt-2.5 text-xs text-muted-foreground">
                    <span>{formatDOP(15000)}</span>
                    <span>{formatDOP(150000)}</span>
                  </div>
                </div>

                {/* Tenure */}
                <div>
                  <div className="flex items-baseline justify-between mb-5">
                    <label className="text-sm font-medium text-muted-foreground">Antigüedad</label>
                    <span className="font-headline text-3xl font-bold text-foreground">
                      {tenure} {tenure === 1 ? 'año' : 'años'}
                    </span>
                  </div>
                  <Slider
                    value={[tenure]}
                    onValueChange={([value]) => setTenure(value)}
                    min={0}
                    max={10}
                    step={0.5}
                    className="w-full"
                  />
                  <div className="flex justify-between mt-2.5 text-xs text-muted-foreground">
                    <span>Nuevo</span>
                    <span>10+ años</span>
                  </div>
                </div>
              </div>

              {/* Results — 2 cols */}
              <div className="md:col-span-2 bg-foreground p-8 md:p-10 flex flex-col justify-between">
                <div>
                  <p className="text-background/50 text-sm mb-2">Tu Límite Disponible</p>
                  <p className="font-headline text-4xl md:text-5xl font-extrabold text-primary mb-8">
                    {formatDOP(advanceLimit.maxAdvanceAmount)}
                  </p>

                  <div className="space-y-4">
                    <ResultRow
                      icon={<Shield className="w-4 h-4" />}
                      label="Respaldo Laboral"
                      value={formatDOP(advanceLimit.collateralBase)}
                    />
                    <ResultRow
                      icon={<TrendingUp className="w-4 h-4" />}
                      label={`Comisión (${feeLabel})`}
                      value={formatDOP(advanceDetails.fee)}
                    />
                    <div className="h-px bg-background/10 my-2" />
                    <ResultRow
                      icon={<Clock className="w-4 h-4" />}
                      label="Descuento en Nómina"
                      value={formatDOP(advanceDetails.totalToDeduct)}
                      highlight
                    />
                  </div>
                </div>

                <div className="mt-8">
                  <Button variant="hero" className="w-full rounded-2xl bg-primary" asChild>
                    <Link to="/login">
                      Solicitar Ahora
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </Button>
                  <p className="text-background/30 text-xs text-center mt-4">
                    *Estimado. Monto final sujeto a validación.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ResultRow({
  icon,
  label,
  value,
  highlight = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-background/50">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <span className={`font-semibold ${highlight ? 'text-primary text-lg' : 'text-background'}`}>
        {value}
      </span>
    </div>
  );
}
