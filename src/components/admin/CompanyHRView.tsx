import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Building2, Users, Download } from "lucide-react";
import { formatDOP } from "@/lib/advance-calculator";
import { Progress } from "@/components/ui/progress";
import { mockEmployees, mockEmployers, hrActiveAdvances, hrPendingRequests } from "@/lib/mock-data";
import { EmployeeManagement } from "@/components/hr/EmployeeManagement";
import { CollateralCoverageChart } from "@/components/hr/CollateralCoverageChart";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle2, XCircle } from "lucide-react";

interface CompanyHRViewProps {
  companyName: string;
  onBack: () => void;
}

export function CompanyHRView({ companyName, onBack }: CompanyHRViewProps) {
  const employer = mockEmployers.find((e) => e.name === companyName);
  if (!employer) return null;

  const companyEmployees = mockEmployees.filter((e) => e.employer === companyName);
  const adoptionRate = Math.round((employer.active / employer.workers) * 100);
  const companyAdvances = hrActiveAdvances; // In real app, filter by company
  const totalActive = companyAdvances.reduce((s, a) => s + a.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            <h2 className="font-headline text-2xl font-bold text-foreground">{companyName}</h2>
            <Badge variant="outline" className="bg-accent text-accent-foreground">{employer.riskRating}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">RNC: {employer.rnc} · {employer.sector} · Vista administrativa</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-primary to-primary-container rounded-3xl p-6 text-primary-foreground">
          <p className="text-primary-foreground/70 text-sm">Total Adelantado</p>
          <p className="font-headline text-3xl font-extrabold mt-1">{formatDOP(totalActive)}</p>
          <p className="text-sm mt-2 text-primary-foreground/70">{companyAdvances.length} adelantos activos</p>
        </div>
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-card">
          <div className="flex items-center gap-2 mb-3"><Users className="w-5 h-5 text-primary" /><span className="text-sm text-muted-foreground">Empleados</span></div>
          <p className="font-headline text-3xl font-extrabold text-foreground">{employer.active.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-1">de {employer.workers.toLocaleString()} registrados</p>
          <div className="mt-3">
            <div className="flex justify-between text-xs text-muted-foreground mb-1"><span>Adopción</span><span className="font-semibold text-foreground">{adoptionRate}%</span></div>
            <Progress value={adoptionRate} className="h-2" />
          </div>
        </div>
        <CollateralCoverageChart totalCollateral={employer.collateral} totalActiveAdvances={totalActive} />
      </div>

      {/* Pending Requests (read-only for admin) */}
      <section className="bg-surface-container-lowest rounded-2xl shadow-card">
        <div className="p-6">
          <h3 className="font-headline text-lg font-bold text-foreground">Solicitudes Pendientes</h3>
          <p className="text-sm text-muted-foreground">Vista administrativa — solo lectura</p>
        </div>
        <div className="px-6 pb-6 space-y-3">
          {hrPendingRequests.slice(0, 3).map((req) => (
            <div key={req.id} className="flex items-center gap-4 bg-surface-container-low rounded-2xl p-4">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-primary font-bold text-sm">{req.avatar}</div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{req.employee}</p>
                <p className="text-xs text-muted-foreground">{req.cedula} · {req.department}</p>
              </div>
              <p className="font-headline font-bold text-foreground">{formatDOP(req.amount)}</p>
              <Badge variant="outline" className="bg-warning/10 text-warning">Pendiente</Badge>
            </div>
          ))}
        </div>
      </section>

      {/* Employee list */}
      <EmployeeManagement employees={companyEmployees} companyName={companyName} />
    </div>
  );
}
