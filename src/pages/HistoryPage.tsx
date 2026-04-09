import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { formatDOP } from "@/lib/advance-calculator";
import { BottomNav } from "@/components/shared/BottomNav";

const mockHistory = [
  { id: "adv-2024-0147", amount: 6000, totalToDeduct: 6200, date: "15 Ene 2024", status: "active" as const },
  { id: "adv-2023-0098", amount: 4500, totalToDeduct: 4700, date: "12 Dic 2023", status: "completed" as const },
  { id: "adv-2023-0072", amount: 3000, totalToDeduct: 3200, date: "20 Nov 2023", status: "completed" as const },
  { id: "adv-2023-0045", amount: 5000, totalToDeduct: 5200, date: "10 Oct 2023", status: "completed" as const },
  { id: "adv-2023-0021", amount: 2500, totalToDeduct: 2700, date: "05 Sep 2023", status: "completed" as const },
];

const statusConfig = {
  active: { label: "Activo", className: "bg-blue-50 text-blue-600" },
  completed: { label: "Completado", className: "bg-green-50 text-green-600" },
  pending: { label: "Pendiente", className: "bg-amber-50 text-amber-600" },
};

export default function HistoryPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface-container-low pb-28">
      <header className="bg-surface-container-lowest sticky top-0 z-50 shadow-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/employee")} className="p-2 rounded-xl hover:bg-surface-container-low transition-colors">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <h1 className="font-headline font-bold text-foreground">Historial</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-lg">
        <div className="bg-surface-container-lowest rounded-2xl shadow-card overflow-hidden">
          <div className="divide-y divide-outline-variant/10">
            {mockHistory.map((item) => {
              const config = statusConfig[item.status];
              return (
                <button
                  key={item.id}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-surface-container-low transition-colors text-left"
                  onClick={() => item.status === "active" && navigate("/advance/active")}
                >
                  <div>
                    <p className="font-medium text-foreground text-sm">Adelanto {formatDOP(item.amount)}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.date} · {item.id}</p>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
                      {config.label}
                    </span>
                    <span className="text-sm font-semibold text-foreground">{formatDOP(item.totalToDeduct)}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </main>

      <BottomNav activeTab="history" />
    </div>
  );
}
