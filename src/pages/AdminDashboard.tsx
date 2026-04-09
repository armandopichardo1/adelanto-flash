import { useEffect } from "react";
import { FeeConfigPanel } from "@/components/admin/FeeConfigPanel";
import { RiskConfigPanel } from "@/components/admin/RiskConfigPanel";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Wallet,
  Settings,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  Activity,
  Home,
  LogOut,
  Bell,
} from "lucide-react";
import { formatDOP, formatPercent } from "@/lib/advance-calculator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, PieChart, Pie, Cell, ComposedChart,
} from "recharts";
import { toast } from "sonner";
import {
  adminKPIs,
  adminMonthlyData,
  adminCompanyProfitData,
  adminPortfolioData,
  adminPendingDisbursements,
} from "@/lib/mock-data";

export default function AdminDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const session = localStorage.getItem("adelantoYaSession");
    if (!session) { navigate("/login"); return; }
    const parsed = JSON.parse(session);
    if (parsed.type !== "admin") { toast.error("Acceso no autorizado"); navigate("/login"); }
  }, [navigate]);

  const handleLogout = () => { localStorage.removeItem("adelantoYaSession"); toast.success("Sesión cerrada"); navigate("/"); };

  return (
    <div className="min-h-screen bg-surface-container-low">
      <header className="bg-surface-container-lowest sticky top-0 z-50 shadow-card">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/" className="w-10 h-10 rounded-2xl gradient-hero flex items-center justify-center"><Wallet className="w-5 h-5 text-primary-foreground" /></Link>
              <span className="font-headline font-bold text-foreground hidden sm:inline">Adelanto Ya</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              {["Dashboard", "Empresas", "Configuración", "Reportes"].map((l) => (
                <button key={l} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">{l}</button>
              ))}
            </nav>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon"><Bell className="w-5 h-5" /></Button>
              <Button variant="ghost" size="icon"><Settings className="w-5 h-5" /></Button>
              <Button variant="ghost" size="icon" asChild><Link to="/"><Home className="w-5 h-5" /></Link></Button>
              <Button variant="ghost" size="icon" onClick={handleLogout}><LogOut className="w-5 h-5" /></Button>
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground text-xs font-bold ml-2">SA</div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Title */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-headline text-3xl md:text-4xl font-extrabold text-foreground">Panel del Super Admin</h1>
            <p className="text-muted-foreground mt-1">Visión global de liquidez, riesgo y rendimiento corporativo de Adelanto Ya.</p>
          </div>
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" /> Operativo
          </span>
        </div>

        <FeeConfigPanel />

        {/* KPIs */}
        <section>
          <h2 className="font-headline text-xl font-bold text-foreground mb-4">Indicadores Críticos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard icon={<BarChart3 className="w-5 h-5" />} label="Ratio Cobertura de Garantía" value={`${adminKPIs.collateralCoverage.toFixed(1)}x`} badge="META > 2.0x" badgeColor={adminKPIs.collateralCoverage >= 2 ? "bg-accent text-accent-foreground" : "bg-warning/10 text-warning"} status={adminKPIs.collateralCoverage >= 2 ? "success" : "warning"} />
            <KPICard icon={<AlertTriangle className="w-5 h-5" />} label="Tasa de Morosidad Real" value={formatPercent(adminKPIs.defaultRate)} badge="ALERTA > 4%" badgeColor={adminKPIs.defaultRate <= 0.04 ? "bg-accent text-accent-foreground" : "bg-destructive/10 text-destructive"} status={adminKPIs.defaultRate <= 0.04 ? "success" : "danger"} />
            <KPICard icon={<Activity className="w-5 h-5" />} label="Velocidad de Capital" value={`${adminKPIs.capitalVelocity.toFixed(1)} días`} badge="Óptimo < 15d" badgeColor={adminKPIs.capitalVelocity <= 15 ? "bg-accent text-accent-foreground" : "bg-warning/10 text-warning"} status={adminKPIs.capitalVelocity <= 15 ? "success" : "warning"} />
            <KPICard icon={<TrendingUp className="w-5 h-5" />} label="Tasa de Adopción" value={formatPercent(adminKPIs.adoptionRate)} badge="Meta > 60%" badgeColor={adminKPIs.adoptionRate >= 0.6 ? "bg-accent text-accent-foreground" : "bg-warning/10 text-warning"} status={adminKPIs.adoptionRate >= 0.6 ? "success" : "warning"} />
          </div>
        </section>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2 bg-surface-container-lowest rounded-2xl shadow-card p-6">
            <h3 className="font-headline text-lg font-bold text-foreground mb-4">Beneficio Neto por Empresa (RD$)</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={adminCompanyProfitData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--outline-variant))" strokeOpacity={0.3} />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `${v / 1000}k`} />
                  <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} width={130} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "none", borderRadius: "12px", boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }} formatter={(value: number) => formatDOP(value)} />
                  <Bar dataKey="profit" fill="hsl(var(--primary))" name="Ganancia" radius={[0, 8, 8, 0]} />
                  <Bar dataKey="default" fill="hsl(var(--destructive))" name="Morosidad" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
          <section className="bg-surface-container-lowest rounded-2xl shadow-card p-6">
            <h3 className="font-headline text-lg font-bold text-foreground mb-4">Distribución de Cartera</h3>
            <div className="h-48 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart><Pie data={adminPortfolioData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" stroke="none">
                  {adminPortfolioData.map((entry, i) => <Cell key={`cell-${i}`} fill={entry.color} />)}
                </Pie></PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="font-headline text-2xl font-bold text-foreground">{adminPortfolioData[0].value}%</p>
                <p className="text-xs text-muted-foreground">SEGURO</p>
              </div>
            </div>
            <div className="flex justify-center gap-4 mt-2">
              {adminPortfolioData.map((d) => (
                <div key={d.name} className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} /><span className="text-xs text-muted-foreground">{d.name}</span></div>
              ))}
            </div>
          </section>
        </div>

        {/* Trend */}
        <section className="bg-surface-container-lowest rounded-2xl shadow-card p-6">
          <h3 className="font-headline text-lg font-bold text-foreground mb-4">Tendencia Mensual — Crecimiento ZF</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={adminMonthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--outline-variant))" strokeOpacity={0.3} />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `${v / 1000000}M`} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "none", borderRadius: "12px", boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }} formatter={(value: number) => formatDOP(value)} />
                <Line type="monotone" dataKey="disbursed" stroke="hsl(var(--primary))" strokeWidth={2} name="Desembolsado" dot={{ fill: "hsl(var(--primary))" }} />
                <Line type="monotone" dataKey="recovered" stroke="hsl(var(--secondary))" strokeWidth={2} name="Recuperado" dot={{ fill: "hsl(var(--secondary))" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <RiskConfigPanel />

        {/* Disbursement Queue */}
        <section className="bg-surface-container-lowest rounded-2xl shadow-card overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div><h2 className="font-headline text-xl font-bold text-foreground">Cola de Desembolsos Manuales</h2><p className="text-muted-foreground">Transferencias aprobadas pendientes de ejecución</p></div>
              <Badge variant="outline" className="text-primary border-primary">{adminPendingDisbursements.length} pendientes</Badge>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="bg-surface-container-low hover:bg-surface-container-low">
                <TableHead>Solicitante / Empresa</TableHead><TableHead>Monto Solicitado</TableHead><TableHead>Ratio Colateral</TableHead><TableHead>Fecha Solicitud</TableHead><TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {adminPendingDisbursements.map((item) => (
                <TableRow key={item.id} className="border-outline-variant/15">
                  <TableCell><div><p className="font-medium">{item.employee}</p><p className="text-xs text-muted-foreground">{item.company}</p></div></TableCell>
                  <TableCell className="font-semibold">{formatDOP(item.amount)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 rounded-full bg-surface-container-high overflow-hidden"><div className={`h-full rounded-full ${item.collateralRatio >= 2 ? "bg-primary" : "bg-warning"}`} style={{ width: `${Math.min(100, (item.collateralRatio / 6) * 100)}%` }} /></div>
                      <span className="text-sm font-medium">{item.collateralRatio.toFixed(1)}x</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{item.requestDate}</TableCell>
                  <TableCell className="text-right"><Button variant="default" size="sm"><CheckCircle2 className="w-4 h-4" /> Aprobar</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>

        {/* Company Health */}
        <section className="bg-surface-container-lowest rounded-2xl shadow-card overflow-hidden">
          <div className="p-6"><h2 className="font-headline text-xl font-bold text-foreground">Salud de Empresas</h2><p className="text-muted-foreground">Rentabilidad neta y alertas por cliente</p></div>
          <Table>
            <TableHeader><TableRow className="bg-surface-container-low hover:bg-surface-container-low"><TableHead>Empresa</TableHead><TableHead>Ganancia Neta</TableHead><TableHead>Morosidad</TableHead><TableHead>Estado</TableHead></TableRow></TableHeader>
            <TableBody>
              {adminCompanyProfitData.map((c) => (
                <TableRow key={c.name} className="border-outline-variant/15">
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell className="font-semibold text-primary">{formatDOP(c.profit)}</TableCell>
                  <TableCell className={c.default > 0 ? "text-destructive font-semibold" : "text-muted-foreground"}>{formatDOP(c.default)}</TableCell>
                  <TableCell><StatusBadge status={c.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>
      </main>
    </div>
  );
}

function KPICard({ icon, label, value, badge, badgeColor, status }: { icon: React.ReactNode; label: string; value: string; badge: string; badgeColor: string; status: "success" | "warning" | "danger" }) {
  const borderColors = { success: "border-l-primary", warning: "border-l-warning", danger: "border-l-destructive" };
  return (
    <div className={`bg-surface-container-lowest rounded-2xl p-5 shadow-card border-l-4 ${borderColors[status]}`}>
      <div className="flex items-center gap-2 text-muted-foreground mb-2">{icon}<span className="text-sm font-medium">{label}</span></div>
      <p className="font-headline text-3xl font-bold text-foreground mb-2">{value}</p>
      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${badgeColor}`}>{badge}</span>
    </div>
  );
}


function StatusBadge({ status }: { status: "healthy" | "warning" | "toxic" }) {
  const config = { healthy: { label: "Saludable", className: "bg-accent text-accent-foreground" }, warning: { label: "Precaución", className: "bg-warning/10 text-warning" }, toxic: { label: "Tóxico", className: "bg-destructive/10 text-destructive" } };
  return <Badge variant="outline" className={config[status].className}>{config[status].label}</Badge>;
}
