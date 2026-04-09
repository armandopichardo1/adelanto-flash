import { useState, useMemo } from "react";
import { Slider } from "@/components/ui/slider";
import { 
  calculateAdvanceLimit, 
  calculateAdvanceDetails, 
  formatDOP,
  getFeeLabel,
  DEFAULT_FEE_CONFIG,
} from "@/lib/advance-calculator";
import { Calculator, TrendingUp, Shield, Clock } from "lucide-react";

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
    <section className="py-20 md:py-28 bg-surface-container-low">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-4">
            <Calculator className="w-4 h-4" />
            <span>Calculadora de Adelanto</span>
          </div>
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-foreground mb-4">
            Calcula Tu Límite
          </h2>
          <p className="text-lg text-muted-foreground">
            Descubre cuánto puedes solicitar basado en tu salario y antigüedad.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-surface-container-lowest rounded-3xl shadow-card p-8 md:p-10">
            <div className="grid md:grid-cols-2 gap-10">
              {/* Inputs */}
              <div className="space-y-8">
                {/* Salary Input */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-sm font-medium text-foreground">
                      Salario Mensual
                    </label>
                    <span className="font-headline text-2xl font-bold text-primary">
                      {formatDOP(salary)}
                    </span>
                  </div>
                  <Slider
                    value={[salary]}
                    onValueChange={([value]) => setSalary(value)}
                    min={15000}
                    max={150000}
                    step={5000}
                    className="w-full"
                  />
                  <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                    <span>{formatDOP(15000)}</span>
                    <span>{formatDOP(150000)}</span>
                  </div>
                </div>

                {/* Tenure Input */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-sm font-medium text-foreground">
                      Años de Antigüedad
                    </label>
                    <span className="font-headline text-2xl font-bold text-primary">
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
                  <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                    <span>0 años</span>
                    <span>10+ años</span>
                  </div>
                </div>
              </div>

              {/* Results */}
              <div className="bg-surface-container-low rounded-2xl p-6">
                <h3 className="font-headline text-lg font-semibold text-foreground mb-6">
                  Tu Resultado
                </h3>

                <div className="text-center mb-6">
                  <p className="text-sm text-muted-foreground mb-2">
                    Límite de Adelanto Disponible
                  </p>
                  <p className="font-headline text-5xl font-bold text-primary">
                    {formatDOP(advanceLimit.maxAdvanceAmount)}
                  </p>
                </div>

                <div className="space-y-4">
                  <ResultRow 
                    icon={<Shield className="w-4 h-4" />}
                    label="Tu Respaldo Laboral"
                    value={formatDOP(advanceLimit.collateralBase)}
                  />
                  <ResultRow 
                    icon={<TrendingUp className="w-4 h-4" />}
                    label={`Comisión de servicio (${feeLabel})`}
                    value={formatDOP(advanceDetails.fee)}
                  />
                  <ResultRow 
                    icon={<Clock className="w-4 h-4" />}
                    label="Total a Descontar"
                    value={formatDOP(advanceDetails.totalToDeduct)}
                    highlight
                  />
                </div>

                <p className="text-xs text-muted-foreground text-center mt-6">
                  *Cálculo estimado basado en el Código Laboral de RD. 
                  El monto final puede variar según validación.
                </p>
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
  highlight = false 
}: { 
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between p-3 rounded-xl ${highlight ? 'bg-accent' : ''}`}>
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <span className={`font-semibold ${highlight ? 'text-primary text-lg' : 'text-foreground'}`}>
        {value}
      </span>
    </div>
  );
}
