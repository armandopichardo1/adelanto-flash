import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { 
  Wallet, 
  TrendingUp, 
  Clock, 
  Shield, 
  ChevronRight,
  Award,
  Zap,
  History,
  RefreshCw,
  LogOut,
  Home
} from "lucide-react";
import { 
  calculateAdvanceLimit, 
  calculateAdvanceDetails, 
  formatDOP, 
  getTenureLevel,
  getFeeLabel,
  DEFAULT_FEE_CONFIG,
} from "@/lib/advance-calculator";
import { checkSmartRefill, calculateRefillDetails, type ActiveAdvance } from "@/lib/smart-refill";
import { PatrimonioCard } from "@/components/employee/PatrimonioCard";
import { DineroScoreGauge } from "@/components/employee/DineroScoreGauge";
import { SavingsComparison } from "@/components/employee/SavingsComparison";
import { toast } from "sonner";

// Mock employee data
const mockEmployee = {
  name: "María García",
  company: "Tech Solutions SRL",
  monthlySalary: 45000,
  tenureYears: 2.5,
  riskMode: 'conservative' as const,
  preApproved: true,
  repaidCycles: 3, // For Dinero Score
};

// Mock active advance for Smart Refill demo (set to null for no active advance)
const mockActiveAdvance: ActiveAdvance | null = {
  id: "adv-001",
  amount: 5000,
  fee: 200,
  totalToDeduct: 5200,
  disbursedDate: "2024-01-10",
  status: 'active',
};

const tenureLevelConfig = {
  bronze: { label: "Bronce", color: "text-amber-600", bg: "bg-amber-100", progress: 25 },
  silver: { label: "Plata", color: "text-slate-500", bg: "bg-slate-100", progress: 50 },
  gold: { label: "Oro", color: "text-yellow-500", bg: "bg-yellow-100", progress: 75 },
  platinum: { label: "Platino", color: "text-purple-500", bg: "bg-purple-100", progress: 100 },
};

export default function EmployeeDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const session = localStorage.getItem("adelantoYaSession");
    if (!session) {
      toast.error("Por favor inicia sesión para continuar");
      navigate("/login");
      return;
    }
    const parsed = JSON.parse(session);
    if (parsed.type !== "employee") {
      toast.error("Acceso no autorizado");
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adelantoYaSession");
    toast.success("Sesión cerrada");
    navigate("/");
  };

  const advanceLimit = useMemo(() => calculateAdvanceLimit({
    monthlySalary: mockEmployee.monthlySalary,
    tenureYears: mockEmployee.tenureYears,
    riskMode: mockEmployee.riskMode,
  }), []);

  // Smart Refill logic
  const smartRefill = useMemo(() => 
    checkSmartRefill(mockActiveAdvance, advanceLimit.maxAdvanceAmount), 
    [advanceLimit.maxAdvanceAmount]
  );

  // For Smart Refill: max is remaining available, min is 1000
  const sliderMax = smartRefill.canRefill ? smartRefill.remainingAvailable : advanceLimit.maxAdvanceAmount;
  const sliderMin = 1000;
  
  const [requestedAmount, setRequestedAmount] = useState(
    Math.floor(Math.min(sliderMax / 2, sliderMax))
  );
  
  // Ensure requested amount doesn't exceed slider max
  useEffect(() => {
    if (requestedAmount > sliderMax) {
      setRequestedAmount(sliderMax);
    }
  }, [sliderMax, requestedAmount]);

  const advanceDetails = useMemo(() => {
    if (smartRefill.canRefill) {
      return calculateRefillDetails(requestedAmount, mockEmployee.monthlySalary);
    }
    return calculateAdvanceDetails(requestedAmount, mockEmployee.monthlySalary);
  }, [requestedAmount, smartRefill.canRefill]);

  const tenureConfig = tenureLevelConfig[advanceLimit.tenureLevel];
  const feeLabel = getFeeLabel(DEFAULT_FEE_CONFIG);

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-background border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center">
                <Wallet className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-bold text-foreground">Adelanto Ya</h1>
                <p className="text-xs text-muted-foreground">{mockEmployee.company}</p>
              </div>
            </Link>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" asChild>
                <Link to="/">
                  <Home className="w-5 h-5" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6 pb-24">
        {/* Welcome Card */}
        <div className="bg-background rounded-2xl p-6 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-muted-foreground text-sm">¡Hola!</p>
              <h2 className="text-2xl font-bold text-foreground">{mockEmployee.name}</h2>
            </div>
            {mockEmployee.preApproved && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent text-accent-foreground text-sm font-medium">
                <Zap className="w-4 h-4" />
                Pre-Aprobado
              </span>
            )}
          </div>

          {/* Tenure Progress */}
          <div className="bg-muted/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Award className={`w-5 h-5 ${tenureConfig.color}`} />
                <span className="font-semibold text-foreground">Nivel {tenureConfig.label}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {mockEmployee.tenureYears.toFixed(1)} años de antigüedad
              </span>
            </div>
            <Progress value={tenureConfig.progress} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {advanceLimit.tenureLevel === 'platinum' 
                ? '¡Máximo nivel alcanzado! Disfruta de los mejores límites.'
                : `Continúa construyendo tu historial para desbloquear mejores beneficios.`
              }
            </p>
          </div>
        </div>

        {/* Patrimonio Disponible Card (Anti-Debt UI) */}
        <PatrimonioCard 
          collateralBase={advanceLimit.collateralBase}
          availableToday={advanceLimit.maxAdvanceAmount}
          tenureYears={mockEmployee.tenureYears}
        />

        {/* Dinero Score Gauge */}
        <DineroScoreGauge 
          tenureYears={mockEmployee.tenureYears}
          repaidCycles={mockEmployee.repaidCycles}
        />

        {/* Advance Request Card */}
        <div className="bg-background rounded-2xl p-6 shadow-soft">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-1">
              {smartRefill.canRefill ? 'Recargar Adelanto' : 'Solicitar Adelanto Flash'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {smartRefill.canRefill 
                ? `Ya tienes ${formatDOP(smartRefill.currentlyUsed)} activo. Recarga hasta ${formatDOP(smartRefill.remainingAvailable)} más.`
                : 'Desliza para elegir tu monto'
              }
            </p>
          </div>

          {/* Amount Display */}
          <div className="text-center mb-4">
            <p className="text-5xl font-bold text-primary mb-2 tabular-nums">
              {formatDOP(requestedAmount)}
            </p>
            <p className="text-muted-foreground">
              {smartRefill.canRefill 
                ? `Recarga disponible: ${formatDOP(smartRefill.remainingAvailable)}`
                : `Límite disponible: ${formatDOP(advanceLimit.maxAdvanceAmount)}`
              }
            </p>
          </div>

          {/* Savings Comparison Pill */}
          <div className="flex justify-center mb-6">
            <SavingsComparison requestedAmount={requestedAmount} monthlySalary={mockEmployee.monthlySalary} />
          </div>

          {/* Slider */}
          <div className="px-2 mb-8">
            <Slider
              value={[requestedAmount]}
              onValueChange={([value]) => setRequestedAmount(value)}
              min={sliderMin}
              max={sliderMax}
              step={500}
              className="w-full"
            />
            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
              <span>{formatDOP(sliderMin)}</span>
              <span>{formatDOP(sliderMax)}</span>
            </div>
          </div>

          {/* Fee Breakdown */}
          <div className="bg-muted/50 rounded-xl p-4 mb-6 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">
                {smartRefill.canRefill ? 'Monto adicional' : 'Monto solicitado'}
              </span>
              <span className="font-semibold text-foreground">{formatDOP(requestedAmount)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Comisión de servicio ({feeLabel})</span>
              <span className="font-semibold text-foreground">
                {formatDOP('incrementalFee' in advanceDetails 
                  ? advanceDetails.incrementalFee
                  : advanceDetails.fee
                )}
              </span>
            </div>
            {smartRefill.canRefill && (
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>* Comisión solo sobre el monto adicional</span>
              </div>
            )}
            <div className="border-t border-border pt-3 flex justify-between items-center">
              <span className="font-semibold text-foreground">
                {smartRefill.canRefill ? 'Total adicional a descontar' : 'Total a Descontar'}
              </span>
              <span className="font-bold text-xl text-foreground">
                {formatDOP('incrementalTotalToDeduct' in advanceDetails 
                  ? advanceDetails.incrementalTotalToDeduct
                  : advanceDetails.totalToDeduct
                )}
              </span>
            </div>
          </div>

          {/* CTA Button */}
          <Button variant="flash" size="xl" className="w-full">
            {smartRefill.canRefill ? (
              <>
                <RefreshCw className="w-5 h-5" />
                Recargar Adelanto
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                Solicitar Adelanto Flash
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center mt-4">
            Al solicitar, aceptas los términos y condiciones del servicio.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <QuickStat
            icon={<Shield className="w-5 h-5" />}
            label="Tu Respaldo"
            value={formatDOP(advanceLimit.collateralBase)}
            sublabel="Valor laboral acumulado"
          />
          <QuickStat
            icon={<TrendingUp className="w-5 h-5" />}
            label="Límite mensual"
            value={formatDOP(advanceLimit.salaryCapLimit)}
            sublabel="30% de tu salario"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-background rounded-2xl shadow-soft divide-y divide-border">
          <QuickAction
            icon={<History className="w-5 h-5" />}
            label="Historial de Adelantos"
            sublabel="Ver todos tus adelantos anteriores"
          />
          <QuickAction
            icon={<Clock className="w-5 h-5" />}
            label="Próximo Pago"
            sublabel="15 de enero, 2024"
          />
        </div>
      </main>
    </div>
  );
}

function QuickStat({ 
  icon, 
  label, 
  value, 
  sublabel 
}: { 
  icon: React.ReactNode;
  label: string;
  value: string;
  sublabel: string;
}) {
  return (
    <div className="bg-background rounded-xl p-4 shadow-soft">
      <div className="flex items-center gap-2 text-primary mb-2">
        {icon}
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
      </div>
      <p className="text-xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{sublabel}</p>
    </div>
  );
}

function QuickAction({ 
  icon, 
  label, 
  sublabel 
}: { 
  icon: React.ReactNode;
  label: string;
  sublabel: string;
}) {
  return (
    <button className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors text-left">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-primary">
          {icon}
        </div>
        <div>
          <p className="font-medium text-foreground">{label}</p>
          <p className="text-sm text-muted-foreground">{sublabel}</p>
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-muted-foreground" />
    </button>
  );
}
