import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, Clock, Banknote, ArrowLeft } from "lucide-react";
import { formatDOP } from "@/lib/advance-calculator";
import { motion } from "framer-motion";

const steps = [
  { id: "review", label: "En revisión", icon: Clock, description: "Tu solicitud está siendo evaluada" },
  { id: "approved", label: "Aprobado", icon: Check, description: "Tu adelanto fue aprobado" },
  { id: "deposited", label: "Depositado", icon: Banknote, description: "Se ha realizado el depósito" },
];

export default function RequestStatus() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setCurrentStep(1), 3000);
    const t2 = setTimeout(() => setCurrentStep(2), 6000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div className="min-h-screen bg-surface-container-low">
      <header className="bg-surface-container-lowest sticky top-0 z-50 shadow-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/employee")} className="p-2 rounded-xl hover:bg-surface-container-low transition-colors">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <h1 className="font-headline font-bold text-foreground">Estado de tu solicitud</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-lg">
        <div className="bg-surface-container-lowest rounded-3xl shadow-card p-8">
          <div className="space-y-0">
            {steps.map((step, index) => {
              const isActive = index === currentStep;
              const isDone = index < currentStep;
              const StepIcon = step.icon;

              return (
                <div key={step.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0.5 }}
                      animate={{
                        scale: isActive || isDone ? 1 : 0.8,
                        opacity: isActive || isDone ? 1 : 0.4,
                      }}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                        isDone ? "bg-primary text-primary-foreground" :
                        isActive ? "bg-primary/20 text-primary ring-2 ring-primary" :
                        "bg-surface-container text-muted-foreground"
                      }`}
                    >
                      {isDone ? <Check className="w-5 h-5" /> : <StepIcon className="w-5 h-5" />}
                    </motion.div>
                    {index < steps.length - 1 && (
                      <div className={`w-0.5 h-16 ${isDone ? "bg-primary" : "bg-surface-container-high"}`} />
                    )}
                  </div>
                  <div className="pt-2 pb-8">
                    <p className={`font-headline font-bold ${isActive || isDone ? "text-foreground" : "text-muted-foreground"}`}>
                      {step.label}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        Procesando
                      </motion.div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 bg-accent rounded-2xl p-6 text-center"
            >
              <p className="font-headline font-bold text-foreground text-lg">¡Tu dinero está en camino!</p>
              <p className="text-muted-foreground text-sm mt-1">Recibirás una notificación por WhatsApp cuando se deposite</p>
            </motion.div>
          )}

          <Button variant="default" size="lg" className="w-full mt-6" onClick={() => navigate("/employee")}>
            Ir al inicio
          </Button>
        </div>
      </main>
    </div>
  );
}
