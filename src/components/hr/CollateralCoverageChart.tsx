import { Shield, ShieldCheck } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, LabelList } from "recharts";
import { formatDOP } from "@/lib/loan-calculator";

interface CollateralCoverageChartProps {
  totalCollateral: number; // Total Employee Severance Held
  totalActiveAdvances: number; // Total Active Advances (Risk)
}

export function CollateralCoverageChart({ 
  totalCollateral, 
  totalActiveAdvances 
}: CollateralCoverageChartProps) {
  const coverageRatio = totalCollateral > 0 
    ? (totalCollateral / totalActiveAdvances).toFixed(1)
    : "∞";
  
  const isFullyCovered = totalCollateral >= totalActiveAdvances;

  const data = [
    {
      name: "Garantía (Cesantía)",
      value: totalCollateral,
      fill: "hsl(var(--primary))",
    },
    {
      name: "Adelantos Activos",
      value: totalActiveAdvances,
      fill: "hsl(var(--secondary))",
    },
  ];

  return (
    <div className="bg-background rounded-2xl p-6 shadow-soft">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Cobertura de Garantía</h3>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
          isFullyCovered 
            ? "bg-primary/10 text-primary" 
            : "bg-destructive/10 text-destructive"
        }`}>
          <ShieldCheck className="w-4 h-4" />
          {isFullyCovered ? "100% Cubierto" : "Revisar"}
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-6">
        El respaldo total de cesantía cubre {coverageRatio}x los adelantos activos
      </p>

      {/* Chart */}
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 100, left: 5, bottom: 5 }}
          >
            <XAxis type="number" hide />
            <YAxis 
              type="category" 
              dataKey="name" 
              tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
              width={120}
              axisLine={false}
              tickLine={false}
            />
            <Bar 
              dataKey="value" 
              radius={[0, 8, 8, 0]}
              barSize={40}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
              <LabelList 
                dataKey="value" 
                position="right" 
                formatter={(value: number) => formatDOP(value)}
                style={{ 
                  fontSize: 14, 
                  fontWeight: 600,
                  fill: "hsl(var(--foreground))"
                }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <span className="text-sm text-muted-foreground">Cesantía Total (Garantía)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-secondary" />
          <span className="text-sm text-muted-foreground">Adelantos Activos (Riesgo)</span>
        </div>
      </div>
    </div>
  );
}
