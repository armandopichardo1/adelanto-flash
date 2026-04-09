import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, FileText, CreditCard } from "lucide-react";
import { formatDOP } from "@/lib/advance-calculator";
import { currentActiveAdvance } from "@/lib/mock-data";

const paymentSchedule = [
  { date: "31 Ene 2024", amount: 3100, status: "pendiente" },
  { date: "29 Feb 2024", amount: 3100, status: "pendiente" },
];

export default function ActiveLoanDetail() {
  const navigate = useNavigate();
  const advance = currentActiveAdvance;

  return (
    <div className="min-h-screen bg-surface-container-low pb-28">
      <header className="bg-surface-container-lowest sticky top-0 z-50 shadow-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/employee")} className="p-2 rounded-xl hover:bg-surface-container-low transition-colors">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <h1 className="font-headline font-bold text-foreground">Tu Adelanto</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-lg space-y-6">
        {/* Saldo Card */}
        <div className="bg-gradient-to-br from-primary to-primary-container rounded-3xl p-6 text-primary-foreground relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-primary-foreground/10 rounded-full blur-3xl" />
          <p className="text-primary-foreground/70 text-sm">Saldo Pendiente</p>
          <p className="font-headline text-4xl font-extrabold mt-1">{formatDOP(advance.totalToDeduct)}</p>
          <div className="mt-4 flex gap-4 text-sm">
            <div>
              <p className="text-primary-foreground/60">Desembolsado</p>
              <p className="font-semibold">{advance.disbursedDate}</p>
            </div>
            <div>
              <p className="text-primary-foreground/60">ID</p>
              <p className="font-semibold">{advance.id}</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-card">
            <p className="text-muted-foreground text-sm">Próxima Cuota</p>
            <p className="font-headline text-2xl font-bold text-foreground mt-1">{formatDOP(3100)}</p>
          </div>
          <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-card">
            <p className="text-muted-foreground text-sm">Próximo Descuento</p>
            <p className="font-headline text-lg font-bold text-foreground mt-1">31 Ene 2024</p>
          </div>
        </div>

        {/* Payment Calendar */}
        <div className="bg-surface-container-lowest rounded-2xl shadow-card overflow-hidden">
          <div className="p-5 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            <h3 className="font-headline font-semibold text-foreground">Calendario de Pagos</h3>
          </div>
          <div className="divide-y divide-outline-variant/10">
            {paymentSchedule.map((payment, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="font-medium text-foreground text-sm">{payment.date}</p>
                  <p className="text-xs text-muted-foreground capitalize">{payment.status}</p>
                </div>
                <span className="font-semibold text-foreground">{formatDOP(payment.amount)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button variant="flash" size="lg" className="w-full">
            <CreditCard className="w-5 h-5" /> Pagar Anticipadamente
          </Button>
          <Button variant="soft" size="lg" className="w-full">
            <FileText className="w-5 h-5" /> Ver Contrato
          </Button>
        </div>
      </main>
    </div>
  );
}
