import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import {
  Wallet,
  TrendingUp,
  Shield,
  ChevronRight,
  Award,
  Zap,
  RefreshCw,
  LogOut,
  Home,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
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
import { DineroScoreGauge } from "@/components/employee/DineroScoreGauge";
import { SavingsComparison } from "@/components/employee/SavingsComparison";
import { toast } from "sonner";

const mockEmployee = {
  name: "María García",
  company: "Tech Solutions SRL",
  monthlySalary: 45000,
  tenureYears: 2.5,
  riskMode: "conservative" as const,
  preApproved: true,
  repaidCycles: 3,
  joinYear: 2022,
};

const mockActiveAdvance: ActiveAdvance | null = {
  id: "adv-001",
  amount: 5000,
  fee: 200,
  totalToDeduct: 5200,
  disbursedDate: "2024-01-10",
  status: "active",
};

const mockActivity = [
  { id: 1, type: "advance", label: "Adelanto Flash", amount: 5000, date: "10 Ene 2024", icon: ArrowUpRight },
  { id: 2, type: "deduction", label: "Descuento Nómina", amount: -5200, date: "15 Dic 2023", icon: ArrowDownLeft },
  { id: 3, type: "advance", label: "Adelanto Flash", amount: 8000, date: "01 Dic 2023", icon: ArrowUpRight },
  { id: 4, type: "deduction", label: "Descuento Nómina", amount: -8200, date: "15 Nov 2023", icon: ArrowDownLeft },
];

const tenureLevelConfig: Record<string, { label: string; color: string; bg: string; progress: number; next: string; nextYears: number }> = {
  bronze: { label: "Bronce", color: "text-amber-600", bg: "bg-amber-50", progress: 20, next: "Plata", nextYears: 1 },
  silver: { label: "Plata", color: "text-muted-foreground", bg: "bg-surface-container", progress: 40, next: "Oro", nextYears: 2 },
  gold: { label: "Oro", color: "text-yellow-500", bg: "bg-yellow-50", progress: 65, next: "Platino", nextYears: 3 },
  platinum: { label: "Platino", color: "text-secondary", bg: "bg-secondary-container/20", progress: 85, next: "Diamante", nextYears: 5 },
  diamond: { label: "Diamante", color: "text-primary", bg: "bg-accent", progress: 100, next: "", nextYears: 0 },
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

  const advanceLimit = useMemo(
    () =>
      calculateAdvanceLimit({
        monthlySalary: mockEmployee.monthlySalary,
        tenureYears: mockEmployee.tenureYears,
        riskMode: mockEmployee.riskMode,
      }),
    []
  );

  const smartRefill = useMemo(
    () => checkSmartRefill(mockActiveAdvance, advanceLimit.maxAdvanceAmount),
    [advanceLimit.maxAdvanceAmount]
  );

  const sliderMax = smartRefill.canRefill ? smartRefill.remainingAvailable : advanceLimit.maxAdvanceAmount;
  const sliderMin = 1000;

  const [requestedAmount, setRequestedAmount] = useState(Math.floor(Math.min(sliderMax / 2, sliderMax)));

  useEffect(() => {
    if (requestedAmount > sliderMax) setRequestedAmount(sliderMax);
  }, [sliderMax, requestedAmount]);

  const advanceDetails = useMemo(() => {
    if (smartRefill.canRefill) return calculateRefillDetails(requestedAmount, mockEmployee.monthlySalary);
    return calculateAdvanceDetails(requestedAmount, mockEmployee.monthlySalary);
  }, [requestedAmount, smartRefill.canRefill]);

  const tenureLevel = getTenureLevel(mockEmployee.tenureYears);
  const tenureConfig = tenureLevelConfig[tenureLevel] || tenureLevelConfig.bronze;
  const feeLabel = getFeeLabel(DEFAULT_FEE_CONFIG);

  return (
    <div className="min-h-screen bg-surface-container-low">
      {/* Header */}
      <header className="bg-surface-container-lowest sticky top-0 z-50 shadow-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl gradient-hero flex items-center justify-center">
                <Wallet className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-headline font-bold text-foreground">Adelanto Ya</h1>
                <p className="text-xs text-muted-foreground">{mockEmployee.company}</p>
              </div>
            </Link>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" asChild>
                <Link to="/"><Home className="w-5 h-5" /></Link>
              </Button>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6 pb-28">
        {/* Hero Header — Full-width gradient card */}
        <div className="bg-gradient-to-br from-secondary to-primary rounded-3xl p-6 text-primary-foreground relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-primary-foreground/10 rounded-full blur-3xl" />
          <div className="relative">
            <p className="text-primary-foreground/70 text-sm">¡Hola de nuevo!</p>
            <h2 className="font-headline text-3xl font-extrabold mt-1">{mockEmployee.name}</h2>

            {/* Cupo Disponible glassmorphism card */}
            <div className="mt-4 bg-primary-foreground/10 backdrop-blur-lg rounded-2xl p-4">
              <p className="text-primary-foreground/70 text-sm">Cupo Disponible</p>
              <p className="font-headline text-4xl font-extrabold mt-1">
                {formatDOP(advanceLimit.maxAdvanceAmount)}
              </p>
            </div>

            {mockEmployee.preApproved && (
              <span className="inline-flex items-center gap-1 mt-3 px-3 py-1 rounded-full bg-primary-foreground/20 text-primary-foreground text-sm font-medium">
                <Zap className="w-4 h-4" />
                Pre-Aprobado
              </span>
            )}
          </div>
        </div>

        {/* Tenure / Gamified Progress Card */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Award className={`w-6 h-6 ${tenureConfig.color}`} />
              <span className="font-headline font-bold text-lg text-foreground">Nivel {tenureConfig.label}</span>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${tenureConfig.bg} ${tenureConfig.color}`}>
              🏆 {tenureConfig.label}
            </span>
          </div>
          <div className="mb-2">
            <div className="h-3 rounded-full bg-surface-container-high overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-primary-container transition-all duration-700"
                style={{ width: `${tenureConfig.progress}%` }}
              />
            </div>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Ingreso: {mockEmployee.joinYear}</span>
            {tenureConfig.next && (
              <span>Siguiente: {tenureConfig.next} ({tenureConfig.nextYears} años)</span>
            )}
          </div>
        </div>

        {/* Adelanto Flash Card */}
        <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-card">
          <div className="text-center mb-4">
            <span className="material-symbols-outlined text-primary text-3xl">bolt</span>
            <h3 className="font-headline text-lg font-bold text-foreground mt-1">
              {smartRefill.canRefill ? "Recargar Adelanto" : "Adelanto Flash"}
            </h3>
            <p className="text-sm text-muted-foreground">¿Cuánto necesitas?</p>
          </div>

          <div className="text-center mb-4">
            <p className="font-headline text-5xl font-extrabold text-primary tabular-nums">
              {formatDOP(requestedAmount)}
            </p>
          </div>

          <div className="px-2 mb-6">
            <Slider
              value={[requestedAmount]}
              onValueChange={([v]) => setRequestedAmount(v)}
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

          {/* Breakdown */}
          <div className="bg-surface-container-low rounded-2xl p-4 mb-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Recibes</span>
              <span className="font-semibold text-foreground">{formatDOP(requestedAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Comisión de Servicio ({feeLabel})</span>
              <span className="font-semibold text-foreground">
                {formatDOP(
                  "incrementalFee" in advanceDetails ? advanceDetails.incrementalFee : advanceDetails.fee
                )}
              </span>
            </div>
          </div>

          {/* Savings Pill */}
          <div className="flex justify-center mb-6">
            <SavingsComparison requestedAmount={requestedAmount} monthlySalary={mockEmployee.monthlySalary} />
          </div>

          {/* CTA */}
          <Button variant="flash" size="xl" className="w-full" asChild>
            <Link to="/advance-request">
              {smartRefill.canRefill ? (
                <>
                  <RefreshCw className="w-5 h-5" />
                  Recargar Adelanto
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Solicitar Adelanto →
                </>
              )}
            </Link>
          </Button>
        </div>

        {/* Dinero Score Gauge */}
        <DineroScoreGauge tenureYears={mockEmployee.tenureYears} repaidCycles={mockEmployee.repaidCycles} />

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-card">
            <div className="flex items-center gap-2 text-primary mb-2">
              <Shield className="w-5 h-5" />
              <span className="text-sm font-medium text-muted-foreground">Tu Respaldo</span>
            </div>
            <p className="font-headline text-xl font-bold text-foreground">
              {formatDOP(advanceLimit.collateralBase)}
            </p>
            <p className="text-xs text-muted-foreground">Valor laboral acumulado</p>
          </div>
          <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-card">
            <div className="flex items-center gap-2 text-primary mb-2">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm font-medium text-muted-foreground">Límite mensual</span>
            </div>
            <p className="font-headline text-xl font-bold text-foreground">
              {formatDOP(advanceLimit.salaryCapLimit)}
            </p>
            <p className="text-xs text-muted-foreground">30% de tu salario</p>
          </div>
        </div>

        {/* Actividad Reciente */}
        <div className="bg-surface-container-lowest rounded-2xl shadow-card overflow-hidden">
          <div className="p-4 flex items-center justify-between">
            <h3 className="font-headline font-semibold text-foreground">Actividad Reciente</h3>
            <button className="text-sm text-primary font-medium">Ver todo</button>
          </div>
          <div className="divide-y divide-outline-variant/10">
            {mockActivity.map((item) => (
              <div key={item.id} className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                      item.amount > 0 ? "bg-accent text-primary" : "bg-surface-container text-muted-foreground"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.date}</p>
                  </div>
                </div>
                <span
                  className={`font-semibold text-sm tabular-nums ${
                    item.amount > 0 ? "text-primary" : "text-foreground"
                  }`}
                >
                  {item.amount > 0 ? "+" : ""}
                  {formatDOP(Math.abs(item.amount))}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pt-2 pb-6 bg-surface-container-lowest/80 backdrop-blur-xl rounded-t-3xl shadow-[0_-10px_30px_rgba(0,110,42,0.04)] md:hidden">
        <BottomNavItem icon="home" label="Inicio" active />
        <BottomNavItem icon="payments" label="Adelantos" />
        <BottomNavItem icon="receipt_long" label="Historial" />
        <BottomNavItem icon="person" label="Perfil" />
      </nav>
    </div>
  );
}

function BottomNavItem({ icon, label, active = false }: { icon: string; label: string; active?: boolean }) {
  return (
    <button
      className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-colors ${
        active ? "text-primary" : "text-muted-foreground"
      }`}
    >
      <span className="material-symbols-outlined text-[22px]">{icon}</span>
      <span className="text-[11px] font-medium">{label}</span>
    </button>
  );
}
