import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Wallet,
  Users,
  CheckCircle2,
  XCircle,
  Download,
  Search,
  Home,
  LogOut,
  Bell,
  Settings,
} from "lucide-react";
import { formatDOP } from "@/lib/advance-calculator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { CollateralCoverageChart } from "@/components/hr/CollateralCoverageChart";
import { PayrollUpload } from "@/components/hr/PayrollUpload";
import {
  hrCompany,
  hrPendingRequests,
  hrActiveAdvances,
  mockEmployees,
} from "@/lib/mock-data";

export default function HRDashboard() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const session = localStorage.getItem("adelantoYaSession");
    if (!session) { navigate("/login"); return; }
    const parsed = JSON.parse(session);
    if (parsed.type !== "hr") { toast.error("Acceso no autorizado"); navigate("/login"); }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adelantoYaSession");
    toast.success("Sesión cerrada");
    navigate("/");
  };

  const totalActiveAdvances = useMemo(() => hrActiveAdvances.reduce((s, a) => s + a.amount, 0), []);
  const adoptionRate = Math.round((hrCompany.activeUsers / hrCompany.totalEmployees) * 100);

  const handleExportPayroll = () => {
    const now = new Date();
    const dateStr = now.toISOString().split("T")[0];
    const bom = "\uFEFF"; // UTF-8 BOM for Excel compatibility
    const csvContent = bom + [
      ["Empresa", "RNC", "Período", "Fecha Generación"].join(","),
      [hrCompany.name, hrCompany.rnc, `${now.toLocaleDateString("es-DO", { month: "long", year: "numeric" })}`, dateStr].join(","),
      "",
      ["Cédula", "Nombre Completo", "Concepto", "Monto Adelanto (RD$)", "Comisión Servicio (RD$)", "Total a Descontar (RD$)", "Fecha Desembolso", "Estado"].join(","),
      ...hrActiveAdvances.map((a) => [
        a.cedula,
        `"${a.employee}"`,
        "Adelanto de Nómina - Adelanto Ya",
        a.amount,
        a.totalToDeduct - a.amount,
        a.totalToDeduct,
        a.disbursedDate,
        a.status === "active" ? "ACTIVO" : "COMPLETADO",
      ].join(",")),
      "",
      `"Total descuentos:,,,,,${hrActiveAdvances.reduce((s, a) => s + a.totalToDeduct, 0)},,"`,
      `"Registros:,,,,,,${hrActiveAdvances.length},"`,
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nomina_descuentos_${hrCompany.name.replace(/\s+/g, "_")}_${dateStr}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Archivo de nómina exportado: ${hrActiveAdvances.length} descuentos`);
  };

  // Filter employees by the HR company
  const companyEmployees = mockEmployees.filter(e => e.employer === hrCompany.name);

  return (
    <div className="min-h-screen bg-surface-container-low">
      {/* Sticky Header */}
      <header className="bg-surface-container-lowest sticky top-0 z-50 shadow-card">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/" className="w-10 h-10 rounded-2xl gradient-hero flex items-center justify-center">
                <Wallet className="w-5 h-5 text-primary-foreground" />
              </Link>
              <span className="font-headline font-bold text-foreground hidden sm:inline">Adelanto Ya</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              {["Dashboard", "Usuarios", "Reportes"].map((l) => (
                <button key={l} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">{l}</button>
              ))}
            </nav>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon"><Bell className="w-5 h-5" /></Button>
              <Button variant="ghost" size="icon"><Settings className="w-5 h-5" /></Button>
              <Button variant="ghost" size="icon" asChild><Link to="/"><Home className="w-5 h-5" /></Link></Button>
              <Button variant="ghost" size="icon" onClick={handleLogout}><LogOut className="w-5 h-5" /></Button>
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold ml-2">HR</div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Title */}
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1">Panel de Control B2B</p>
          <h1 className="font-headline text-3xl md:text-4xl font-extrabold text-foreground">{hrCompany.name}</h1>
          <p className="text-muted-foreground mt-1 max-w-2xl">Gestiona adelantos de nómina y valida solicitudes de tus empleados en tiempo real.</p>
          <div className="flex gap-3 mt-4">
            <Button variant="default" onClick={handleExportPayroll}><Download className="w-4 h-4" /> Exportar para Nómina (CSV)</Button>
            <Button variant="outline"><UserPlus className="w-4 h-4" /> Nuevo Empleado</Button>
          </div>
        </div>

        {/* Bento Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-primary to-primary-container rounded-3xl p-6 text-primary-foreground relative overflow-hidden">
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-primary-foreground/10 rounded-full blur-3xl" />
            <p className="text-primary-foreground/70 text-sm">Total Adelantado este Mes</p>
            <p className="font-headline text-4xl font-extrabold mt-2">{formatDOP(totalActiveAdvances)}</p>
            <div className="flex gap-6 mt-4 text-sm">
              <div><p className="text-primary-foreground/70">Solicitudes</p><p className="font-bold text-lg">{hrActiveAdvances.length}</p></div>
              <div><p className="text-primary-foreground/70">Pendientes</p><p className="font-bold text-lg">{hrPendingRequests.length}</p></div>
            </div>
          </div>
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-card">
            <div className="flex items-center gap-2 mb-3"><Users className="w-5 h-5 text-primary" /><span className="text-sm font-medium text-muted-foreground">Empleados Activos</span></div>
            <p className="font-headline text-4xl font-extrabold text-foreground">{hrCompany.activeUsers.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">de {hrCompany.totalEmployees.toLocaleString()} registrados</p>
            <div className="mt-3">
              <div className="flex justify-between text-xs text-muted-foreground mb-1"><span>Tasa de adopción</span><span className="font-semibold text-foreground">{adoptionRate}%</span></div>
              <Progress value={adoptionRate} className="h-2" />
            </div>
          </div>
          <CollateralCoverageChart totalCollateral={hrCompany.totalCollateral} totalActiveAdvances={totalActiveAdvances} />
        </div>

        {/* Two-Column */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Action Center */}
          <section className="bg-surface-container-lowest rounded-2xl shadow-card">
            <div className="p-6 flex items-center justify-between">
              <div>
                <h2 className="font-headline text-lg font-bold text-foreground">Centro de Acción</h2>
                <p className="text-muted-foreground text-sm">Solicitudes pendientes de validación</p>
              </div>
              <Badge variant="outline" className="border-primary text-primary">{hrPendingRequests.length} Pendientes</Badge>
            </div>
            <div className="px-6 pb-6 space-y-3">
              {hrPendingRequests.map((req) => (
                <div key={req.id} className="flex items-center gap-4 bg-surface-container-low rounded-2xl p-4">
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-primary font-bold text-sm">{req.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{req.employee}</p>
                    <p className="text-xs text-muted-foreground">{req.cedula} · {req.tenure} años · {req.department}</p>
                  </div>
                  <p className="font-headline font-bold text-foreground whitespace-nowrap">{formatDOP(req.amount)}</p>
                  <div className="flex gap-2">
                    <Button variant="default" size="sm" className="h-8"><CheckCircle2 className="w-4 h-4" /> Validar</Button>
                    <Button variant="outline" size="sm" className="h-8"><XCircle className="w-4 h-4" /></Button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Employee List */}
          <section className="bg-surface-container-lowest rounded-2xl shadow-card overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-headline text-lg font-bold text-foreground">Lista de Empleados</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 w-48" />
                </div>
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="bg-surface-container-low hover:bg-surface-container-low">
                  <TableHead>Empleado</TableHead>
                  <TableHead>Cédula</TableHead>
                  <TableHead>Salario</TableHead>
                  <TableHead>Antigüedad</TableHead>
                  <TableHead>Depto.</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companyEmployees
                  .filter((e) => e.name.toLowerCase().includes(searchTerm.toLowerCase()) || e.cedula.includes(searchTerm))
                  .map((emp) => (
                    <TableRow key={emp.id} className="border-outline-variant/15">
                      <TableCell className="font-medium">{emp.name}</TableCell>
                      <TableCell className="font-mono text-sm">{emp.cedula}</TableCell>
                      <TableCell>{formatDOP(emp.salary)}</TableCell>
                      <TableCell>{emp.tenure} años</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{emp.department}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={emp.status === "ACTIVO" ? "bg-accent text-accent-foreground" : "bg-surface-container text-muted-foreground"}>{emp.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </section>
        </div>
      </main>
    </div>
  );
}
