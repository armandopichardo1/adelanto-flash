import { Shield, Sparkles } from "lucide-react";
import { formatDOP } from "@/lib/advance-calculator";

interface PatrimonioCardProps {
  collateralBase: number;
  availableToday: number;
  tenureYears: number;
}

export function PatrimonioCard({ collateralBase, availableToday, tenureYears }: PatrimonioCardProps) {
  const utilizationPercent = Math.round((availableToday / collateralBase) * 100);

  return (
    <div className="bg-gradient-to-br from-primary to-primary-container rounded-3xl p-6 shadow-[0_20px_40px_rgba(0,110,42,0.1)] text-primary-foreground relative overflow-hidden">
      {/* Decorative blob */}
      <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-primary-foreground/10 rounded-full blur-3xl" />

      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            <h3 className="font-headline font-semibold">Patrimonio Disponible</h3>
          </div>
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary-foreground/20 text-primary-foreground text-xs font-medium">
            <Sparkles className="w-3 h-3" />
            Tu Respaldo
          </span>
        </div>

        {/* Valor Laboral Acumulado */}
        <div className="mb-4">
          <p className="text-primary-foreground/70 text-sm mb-1">Valor Laboral Acumulado</p>
          <p className="font-headline text-3xl font-bold">{formatDOP(collateralBase)}</p>
          <p className="text-primary-foreground/60 text-xs mt-1">
            Antigüedad: {tenureYears.toFixed(1)} años de servicio
          </p>
        </div>

        {/* Divider — subtle line allowed within gradient card */}
        <div className="border-t border-primary-foreground/20 my-4" />

        {/* Disponible Hoy */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-primary-foreground/70 text-sm mb-1">Disponible Hoy</p>
            <p className="font-headline text-4xl font-bold">{formatDOP(availableToday)}</p>
          </div>
          <div className="text-right">
            <p className="font-headline text-2xl font-bold">{utilizationPercent}%</p>
            <p className="text-primary-foreground/60 text-xs">de tu patrimonio</p>
          </div>
        </div>
      </div>
    </div>
  );
}
