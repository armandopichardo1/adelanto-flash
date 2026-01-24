import { Shield, Sparkles } from "lucide-react";
import { formatDOP } from "@/lib/loan-calculator";

interface PatrimonioCardProps {
  collateralBase: number; // Prestaciones Acumuladas (Cesantía)
  availableToday: number; // Disponible Hoy (after risk multiplier)
  tenureYears: number;
}

export function PatrimonioCard({ collateralBase, availableToday, tenureYears }: PatrimonioCardProps) {
  const utilizationPercent = Math.round((availableToday / collateralBase) * 100);

  return (
    <div className="bg-gradient-to-br from-secondary via-secondary to-secondary/90 rounded-2xl p-6 shadow-soft text-secondary-foreground">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          <h3 className="font-semibold">Patrimonio Disponible</h3>
        </div>
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/20 text-primary-foreground text-xs font-medium">
          <Sparkles className="w-3 h-3" />
          Tu Respaldo
        </span>
      </div>

      {/* Prestaciones Acumuladas */}
      <div className="mb-4">
        <p className="text-secondary-foreground/70 text-sm mb-1">Prestaciones Acumuladas</p>
        <p className="text-3xl font-bold">{formatDOP(collateralBase)}</p>
        <p className="text-secondary-foreground/60 text-xs mt-1">
          Cesantía acumulada en {tenureYears.toFixed(1)} años
        </p>
      </div>

      {/* Divider */}
      <div className="border-t border-secondary-foreground/20 my-4" />

      {/* Disponible Hoy */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-secondary-foreground/70 text-sm mb-1">Disponible Hoy</p>
          <p className="text-4xl font-bold text-primary">{formatDOP(availableToday)}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold">{utilizationPercent}%</p>
          <p className="text-secondary-foreground/60 text-xs">de tu patrimonio</p>
        </div>
      </div>
    </div>
  );
}
