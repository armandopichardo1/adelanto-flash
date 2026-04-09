import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  TrendingUp,
  Shield,
  Award,
  Zap,
  RefreshCw,
  FileText,
  AlertTriangle,
} from "lucide-react";
import {
  calculateAdvanceLimit,
  calculateAdvanceDetails,
  formatDOP,
  getTenureLevel,
  getFeeLabel,
} from "@/lib/advance-calculator";
import { useFeeConfig } from "@/hooks/use-fee-config";
import { useRiskConfig } from "@/hooks/use-risk-config";
import { checkSmartRefill, calculateRefillDetails } from "@/lib/smart-refill";
import { DineroScoreGauge } from "@/components/employee/DineroScoreGauge";
import { SavingsComparison } from "@/components/employee/SavingsComparison";
import { ContractSigningModal } from "@/components/employee/ContractSigningModal";
import { TopBar } from "@/components/shared/TopBar";
import { BottomNav } from "@/components/shared/BottomNav";
import {
  currentEmployee,
  currentActiveAdvance,
  mockActivity,
  tenureLevelConfig,
  hrCompany,
} from "@/lib/mock-data";
import {
  getContractForEmployee,
  isEmployeeContractFullySigned,
  type ContractData,
} from "@/lib/contract-template";
import { toast } from "sonner";

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const feeConfig = useFeeConfig();
  const riskConfig = useRiskConfig();

  useEffect(() => {
    const session = localStorage.getItem("adelantoYaSession");
    if (!session) { toast.error("Por favor inicia sesión para continuar"); navigate("/login"); return; }
    const parsed = JSON.parse(session);
    if (parsed.type !== "employee") { toast.error("Acceso no autorizado"); navigate("/login"); }
  }, [navigate]);

  const advanceLimit = useMemo(() => calculateAdvanceLimit({
    monthlySalary: currentEmployee.monthlySalary,
    tenureYears: currentEmployee.tenureYears,
    riskMode: currentEmployee.riskMode,
    feeConfig,
    riskConfig,
  }), [feeConfig, riskConfig]);

  const smartRefill = useMemo(() => checkSmartRefill(currentActiveAdvance, advanceLimit.maxAdvanceAmount), [advanceLimit.maxAdvanceAmount]);
  const sliderMax = smartRefill.canRefill ? smartRefill.remainingAvailable : advanceLimit.maxAdvanceAmount;
  const sliderMin = 1000;
  const [requestedAmount, setRequestedAmount] = useState(Math.floor(Math.min(sliderMax / 2, sliderMax)));

  useEffect(() => { if (requestedAmount > sliderMax) setRequestedAmount(sliderMax); }, [sliderMax, requestedAmount]);

  const advanceDetails = useMemo(() => {
    if (smartRefill.canRefill) return calculateRefillDetails(requestedAmount, currentEmployee.monthlySalary);
    return calculateAdvanceDetails(requestedAmount, currentEmployee.monthlySalary, feeConfig);
  }, [requestedAmount, smartRefill.canRefill, feeConfig]);

  const tenureLevel = getTenureLevel(currentEmployee.tenureYears);
  const tenureConfig = tenureLevelConfig[tenureLevel] || tenureLevelConfig.bronze;
  const feeLabel = getFeeLabel(feeConfig);

  return (
    <div className="min-h-screen bg-surface-container-low">
      <TopBar subtitle={currentEmployee.company} companyName={currentEmployee.company} />

      <main className="container mx-auto px-4 py-6 space-y-6 pb-28">
        {/* Hero Header */}
        <div className="bg-gradient-to-br from-secondary to-primary rounded-3xl p-6 text-primary-foreground relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-primary-foreground/10 rounded-full blur-3xl" />
          <div className="relative">
            <p className="text-primary-foreground/70 text-sm">¡Hola de nuevo!</p>
            <h2 className="font-headline text-3xl font-extrabold mt-1">{currentEmployee.name}</h2>
            <div className="mt-4 bg-primary-foreground/10 backdrop-blur-lg rounded-2xl p-4">
              <p className="text-primary-foreground/70 text-sm">Cupo Disponible</p>
              <p className="font-headline text-4xl font-extrabold mt-1">{formatDOP(advanceLimit.maxAdvanceAmount)}</p>
            </div>
            {currentEmployee.preApproved && (
              <span className="inline-flex items-center gap-1 mt-3 px-3 py-1 rounded-full bg-primary-foreground/20 text-primary-foreground text-sm font-medium">
                <Zap className="w-4 h-4" /> Pre-Aprobado
              </span>
            )}
          </div>
        </div>

        {/* Tenure Card */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Award className={`w-6 h-6 ${tenureConfig.color}`} />
              <span className="font-headline font-bold text-lg text-foreground">Nivel {tenureConfig.label}</span>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${tenureConfig.bg} ${tenureConfig.color}`}>🏆 {tenureConfig.label}</span>
          </div>
          <div className="mb-2">
            <div className="h-3 rounded-full bg-surface-container-high overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-primary to-primary-container transition-all duration-700" style={{ width: `${tenureConfig.progress}%` }} />
            </div>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Ingreso: {currentEmployee.joinYear}</span>
            {tenureConfig.next && <span>Siguiente: {tenureConfig.next} ({tenureConfig.nextYears} años)</span>}
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
            <p className="font-headline text-5xl font-extrabold text-primary tabular-nums">{formatDOP(requestedAmount)}</p>
          </div>
          <div className="px-2 mb-6">
            <Slider value={[requestedAmount]} onValueChange={([v]) => setRequestedAmount(v)} min={sliderMin} max={sliderMax} step={500} className="w-full" />
            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
              <span>{formatDOP(sliderMin)}</span>
              <span>{formatDOP(sliderMax)}</span>
            </div>
          </div>
          <div className="bg-surface-container-low rounded-2xl p-4 mb-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Recibes</span>
              <span className="font-semibold text-foreground">{formatDOP(requestedAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Comisión de Servicio ({feeLabel})</span>
              <span className="font-semibold text-foreground">
                {formatDOP("incrementalFee" in advanceDetails ? advanceDetails.incrementalFee : advanceDetails.fee)}
              </span>
            </div>
          </div>
          <div className="flex justify-center mb-6">
            <SavingsComparison requestedAmount={requestedAmount} monthlySalary={currentEmployee.monthlySalary} />
          </div>
          <Button variant="flash" size="xl" className="w-full" asChild>
            <Link to="/advance-request">
              {smartRefill.canRefill ? (<><RefreshCw className="w-5 h-5" /> Recargar Adelanto</>) : (<><Zap className="w-5 h-5" /> Solicitar Adelanto →</>)}
            </Link>
          </Button>
        </div>

        {/* Dinero Score */}
        <DineroScoreGauge tenureYears={currentEmployee.tenureYears} repaidCycles={currentEmployee.repaidCycles} />

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-card">
            <div className="flex items-center gap-2 text-primary mb-2"><Shield className="w-5 h-5" /><span className="text-sm font-medium text-muted-foreground">Tu Respaldo</span></div>
            <p className="font-headline text-xl font-bold text-foreground">{formatDOP(advanceLimit.collateralBase)}</p>
            <p className="text-xs text-muted-foreground">Valor laboral acumulado</p>
          </div>
          <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-card">
            <div className="flex items-center gap-2 text-primary mb-2"><TrendingUp className="w-5 h-5" /><span className="text-sm font-medium text-muted-foreground">Límite mensual</span></div>
            <p className="font-headline text-xl font-bold text-foreground">{formatDOP(advanceLimit.salaryCapLimit)}</p>
            <p className="text-xs text-muted-foreground">30% de tu salario</p>
          </div>
        </div>

        {/* Actividad Reciente */}
        <div className="bg-surface-container-lowest rounded-2xl shadow-card overflow-hidden">
          <div className="p-4 flex items-center justify-between">
            <h3 className="font-headline font-semibold text-foreground">Actividad Reciente</h3>
            <Link to="/history" className="text-sm text-primary font-medium">Ver todo</Link>
          </div>
          <div className="divide-y divide-outline-variant/10">
            {mockActivity.map((item) => (
              <div key={item.id} className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${item.amount > 0 ? "bg-accent text-primary" : "bg-surface-container text-muted-foreground"}`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.date}</p>
                  </div>
                </div>
                <span className={`font-semibold text-sm tabular-nums ${item.amount > 0 ? "text-primary" : "text-foreground"}`}>
                  {item.amount > 0 ? "+" : ""}{formatDOP(Math.abs(item.amount))}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>

      <BottomNav activeTab="home" />
    </div>
  );
}
