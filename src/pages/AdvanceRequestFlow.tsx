import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Zap, Check, RefreshCw, FileText } from "lucide-react";
import { SignatureCanvas } from "@/components/shared/SignatureCanvas";
import {
  calculateAdvanceLimit,
  calculateAdvanceDetails,
  formatDOP,
  getFeeLabel,
  DEFAULT_FEE_CONFIG,
} from "@/lib/advance-calculator";
import { checkSmartRefill, calculateRefillDetails } from "@/lib/smart-refill";
import { SavingsComparison } from "@/components/employee/SavingsComparison";
import { currentEmployee, currentActiveAdvance } from "@/lib/mock-data";
import { isEmployeeContractFullySigned } from "@/lib/contract-template";
import { toast } from "sonner";

export default function AdvanceRequestFlow() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Block access if contract is not fully signed
  useEffect(() => {
    if (!isEmployeeContractFullySigned("e-01")) {
      toast.error("Debes firmar tu contrato antes de solicitar un adelanto");
      navigate("/employee");
    }
  }, [navigate]);

  const advanceLimit = useMemo(() => calculateAdvanceLimit({
    monthlySalary: currentEmployee.monthlySalary,
    tenureYears: currentEmployee.tenureYears,
    riskMode: currentEmployee.riskMode,
  }), []);

  const smartRefill = useMemo(() => checkSmartRefill(currentActiveAdvance, advanceLimit.maxAdvanceAmount), [advanceLimit.maxAdvanceAmount]);
  const sliderMax = smartRefill.canRefill ? smartRefill.remainingAvailable : advanceLimit.maxAdvanceAmount;
  const sliderMin = 1000;
  const [requestedAmount, setRequestedAmount] = useState(Math.floor(Math.min(sliderMax / 2, sliderMax)));

  const advanceDetails = useMemo(() => {
    if (smartRefill.canRefill) return calculateRefillDetails(requestedAmount, currentEmployee.monthlySalary);
    return calculateAdvanceDetails(requestedAmount, currentEmployee.monthlySalary);
  }, [requestedAmount, smartRefill.canRefill]);

  const feeLabel = getFeeLabel(DEFAULT_FEE_CONFIG);
  const fee = "incrementalFee" in advanceDetails ? advanceDetails.incrementalFee : advanceDetails.fee;
  const totalToDeduct = "incrementalTotalToDeduct" in advanceDetails ? advanceDetails.incrementalTotalToDeduct : advanceDetails.totalToDeduct;

  const handleConfirm = () => {
    if (!termsAccepted) { toast.error("Debes aceptar los términos para continuar"); return; }
    setStep(4);
    toast.success("¡Solicitud enviada exitosamente!");
  };

  if (step === 1) {
    return (
      <div className="min-h-screen bg-surface-container-low">
        <StepHeader title={smartRefill.canRefill ? "Recargar Adelanto" : "Solicitar Adelanto"} onBack={() => navigate("/employee")} step={1} />
        <main className="container mx-auto px-4 py-8 max-w-lg">
          <div className="bg-surface-container-lowest rounded-3xl shadow-card p-8">
            <div className="text-center mb-2">
              <span className="material-symbols-outlined text-primary text-4xl">bolt</span>
              <h2 className="font-headline text-xl font-bold text-foreground mt-2">{smartRefill.canRefill ? "Recargar Adelanto" : "Adelanto Flash"}</h2>
              <p className="text-muted-foreground mt-1">¿Cuánto necesitas?</p>
            </div>
            <div className="text-center my-8">
              <p className="font-headline text-5xl font-extrabold text-primary tabular-nums">{formatDOP(requestedAmount)}</p>
            </div>
            <div className="px-2 mb-8">
              <Slider value={[requestedAmount]} onValueChange={([v]) => setRequestedAmount(v)} min={sliderMin} max={sliderMax} step={500} className="w-full" />
              <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                <span>{formatDOP(sliderMin)}</span><span>{formatDOP(sliderMax)}</span>
              </div>
            </div>
            <div className="bg-surface-container-low rounded-2xl p-4 space-y-3 mb-6">
              <div className="flex justify-between"><span className="text-muted-foreground">Recibes</span><span className="font-semibold text-foreground">{formatDOP(requestedAmount)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Comisión de Servicio ({feeLabel})</span><span className="font-semibold text-foreground">{formatDOP(fee)}</span></div>
            </div>
            <div className="flex justify-center mb-6"><SavingsComparison requestedAmount={requestedAmount} monthlySalary={currentEmployee.monthlySalary} /></div>
            <Button variant="flash" size="xl" className="w-full" onClick={() => setStep(2)}>
              <Zap className="w-5 h-5" /> Continuar
            </Button>
          </div>
        </main>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="min-h-screen bg-surface-container-low">
        <StepHeader title="Tu Oferta Personalizada" onBack={() => setStep(1)} step={2} />
        <main className="container mx-auto px-4 py-8 max-w-lg">
          <div className="bg-surface-container-lowest rounded-3xl shadow-card p-8">
            <div className="text-center mb-6">
              <span className="material-symbols-outlined text-primary text-4xl">verified</span>
              <h2 className="font-headline text-xl font-bold text-foreground mt-2">Tu oferta</h2>
            </div>
            <div className="bg-gradient-to-br from-primary to-primary-container rounded-2xl p-6 text-primary-foreground mb-6">
              <p className="text-primary-foreground/70 text-sm">Monto aprobado</p>
              <p className="font-headline text-4xl font-extrabold mt-1">{formatDOP(requestedAmount)}</p>
            </div>
            <div className="space-y-3 mb-6">
              <OfferRow label="Cuota por nómina" value={formatDOP(totalToDeduct)} />
              <OfferRow label="Comisión de servicio" value={formatDOP(fee)} />
              <OfferRow label="Total a descontar" value={formatDOP(totalToDeduct)} />
              <OfferRow label="Depósito" value="Hoy, 2-4 horas" />
              <OfferRow label="Frecuencia" value="Quincenal" />
            </div>
            <div className="bg-accent rounded-2xl p-4 mb-6">
              <p className="text-sm text-primary font-medium text-center">✓ Sin cargos ocultos · Transparencia total</p>
            </div>
            <div className="space-y-3">
              <Button variant="flash" size="xl" className="w-full" onClick={() => setStep(3)}>
                <Check className="w-5 h-5" /> Aceptar Oferta
              </Button>
              <Button variant="soft" size="lg" className="w-full" onClick={() => setStep(1)}>
                Modificar monto
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="min-h-screen bg-surface-container-low">
        <StepHeader title="Confirmar Solicitud" onBack={() => setStep(2)} step={3} />
        <main className="container mx-auto px-4 py-8 max-w-lg">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="col-span-2 bg-gradient-to-br from-primary to-primary-container rounded-3xl p-6 text-primary-foreground relative overflow-hidden">
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-primary-foreground/10 rounded-full blur-3xl" />
              <p className="text-primary-foreground/70 text-sm">Monto Solicitado</p>
              <p className="font-headline text-4xl font-extrabold mt-1">{formatDOP(requestedAmount)}</p>
            </div>
            <div className="bg-surface-container-lowest rounded-2xl shadow-card p-5">
              <p className="text-muted-foreground text-sm">Comisión de Servicio</p>
              <p className="font-headline text-2xl font-bold text-foreground mt-1">{formatDOP(fee)}</p>
            </div>
            <div className="bg-surface-container-lowest rounded-2xl shadow-card p-5">
              <p className="text-muted-foreground text-sm">Total a Descontar</p>
              <p className="font-headline text-2xl font-bold text-foreground mt-1">{formatDOP(totalToDeduct)}</p>
            </div>
          </div>
          <div className="bg-surface-container-lowest rounded-2xl shadow-card p-6 mb-6">
            <p className="text-sm font-medium text-foreground mb-3">Firma Digital</p>
            <div className="h-32 border-2 border-dashed border-outline-variant rounded-2xl flex items-center justify-center cursor-crosshair bg-surface-container-low">
              <p className="text-muted-foreground text-sm">Firma aquí con el dedo o mouse</p>
            </div>
          </div>
          <div className="bg-surface-container-lowest rounded-2xl shadow-card p-6 mb-6">
            <div className="flex items-start gap-3">
              <Checkbox id="terms" checked={termsAccepted} onCheckedChange={(c) => setTermsAccepted(c === true)} className="mt-1" />
              <label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                Autorizo el descuento automático de mi salario para cubrir el monto total. Entiendo que este es un servicio de adelanto de nómina provisto por <strong className="text-foreground">Adelanto Ya</strong>.
              </label>
            </div>
          </div>
          <Button variant="flash" size="xl" className="w-full" onClick={handleConfirm} disabled={!termsAccepted}>
            <Check className="w-5 h-5" /> Confirmar Solicitud
          </Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-container-low flex items-center justify-center">
      <main className="container mx-auto px-4 py-12 max-w-lg text-center">
        <div className="relative inline-flex items-center justify-center mb-8">
          <div className="absolute w-32 h-32 rounded-full bg-primary/20 animate-ping" />
          <div className="absolute w-24 h-24 rounded-full bg-primary/30 animate-pulse" />
          <div className="relative w-20 h-20 rounded-full bg-primary flex items-center justify-center shadow-button">
            <Check className="w-10 h-10 text-primary-foreground" />
          </div>
        </div>
        <h1 className="font-headline text-3xl font-extrabold text-foreground mb-2">¡Solicitud Exitosa!</h1>
        <p className="text-lg text-muted-foreground mb-8">Tu dinero está en camino</p>
        <div className="bg-surface-container-lowest rounded-2xl shadow-card p-6 mb-8 text-left space-y-4">
          <DetailRow label="Monto" value={formatDOP(requestedAmount)} />
          <DetailRow label="Comisión" value={formatDOP(fee)} />
          <DetailRow label="Total a Descontar" value={formatDOP(totalToDeduct)} highlight />
          <div className="pt-3 border-t border-outline-variant/20 space-y-4">
            <DetailRow label="Banco Destino" value="Banco Popular" />
            <DetailRow label="Fecha Estimada" value="Hoy, 2-4 horas" />
          </div>
        </div>
        <div className="space-y-3">
          <Button variant="default" size="lg" className="w-full" onClick={() => navigate("/request-status")}>Ver estado de solicitud</Button>
          <Button variant="soft" size="lg" className="w-full" onClick={() => navigate("/employee")}>Volver al Inicio</Button>
        </div>
      </main>
    </div>
  );
}

function OfferRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-2">
      <span className="text-muted-foreground text-sm">{label}</span>
      <span className="font-semibold text-foreground">{value}</span>
    </div>
  );
}

function StepHeader({ title, onBack, step }: { title: string; onBack: () => void; step: number }) {
  const totalSteps = 4;
  return (
    <header className="bg-surface-container-lowest sticky top-0 z-50 shadow-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 rounded-xl hover:bg-surface-container-low transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex-1">
            <h1 className="font-headline font-bold text-foreground">{title}</h1>
            <p className="text-xs text-muted-foreground">Paso {step} de {totalSteps}</p>
          </div>
        </div>
      </div>
    </header>
  );
}

function DetailRow({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-muted-foreground text-sm">{label}</span>
      <span className={`font-semibold ${highlight ? "text-primary text-lg" : "text-foreground"}`}>{value}</span>
    </div>
  );
}
