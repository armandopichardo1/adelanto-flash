import { useState, useEffect } from "react";
import { FeeConfigPanel } from "@/components/admin/FeeConfigPanel";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Wallet,
  Settings,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  DollarSign,
  BarChart3,
  Activity,
  Home,
  LogOut,
  Bell,
  Save,
} from "lucide-react";
import { formatDOP, formatPercent } from "@/lib/advance-calculator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { toast } from "sonner";

const kpiData = {
  collateralCoverage: 2.4,
  defaultRate: 0.028,
  capitalVelocity: 12.5,
  totalActivePending: 850000,
  totalCollateralHeld: 2040000,
  adoptionRate: 0.71,
};

const monthlyTrendData = [
  { month: "Ago", disbursed: 320000, recovered: 310000, profit: 22400 },
  { month: "Sep", disbursed: 380000, recovered: 365000, profit: 26600 },
  { month: "Oct", disbursed: 420000, recovered: 400000, profit: 29400 },
  { month: "Nov", disbursed: 490000, recovered: 470000, profit: 34300 },
  { month: "Dic", disbursed: 580000, recovered: 560000, profit: 40600 },
  { month: "Ene", disbursed: 650000, recovered: 620000, profit: 45500 },
];

const companyProfitData = [
  { name: "Tech Solutions", profit: 45000, default: 0, status: "healthy" },
  { name: "Grupo ABC", profit: 32000, default: 2000, status: "warning" },
  { name: "IndustriasDR", profit: 28000, default: 0, status: "healthy" },
  { name: "Comercio Plus", profit: 12000, default: 8000, status: "toxic" },
  { name: "Servicios RD", profit: 22000, default: 500, status: "healthy" },
];

const portfolioData = [
  { name: "Bajo Riesgo", value: 72, color: "hsl(var(--primary))" },
  { name: "En Observación", value: 28, color: "hsl(var(--warning))" },
];

const pendingDisbursements = [
  { id: 1, employee: "María García", company: "Tech Solutions", amount: 15000, collateralRatio: 3.2, requestDate: "2024-01-10" },
  { id: 2, employee: "Juan Pérez", company: "Grupo ABC", amount: 8000, collateralRatio: 1.8, requestDate: "2024-01-10" },
  { id: 3, employee: "Ana Rodríguez", company: "Tech Solutions", amount: 12000, collateralRatio: 5.1, requestDate: "2024-01-09" },
];

export default function AdminDashboard() {
  const navigate = useNavigate();

  // Risk config state
  const [safetyCap, setSafetyCap] = useState(50);
  const [tenureUnder1, setTenureUnder1] = useState(20);
  const [tenure1to3, setTenure1to3] = useState(50);
  const [tenureOver3, setTenureOver3] = useState(80);
  const [maxConcentration, setMaxConcentration] = useState(15);

  useEffect(() => {
    const session = localStorage.getItem("adelantoYaSession");
    if (!session) { navigate("/login"); return; }
    const parsed = JSON.parse(session);
    if (parsed.type !== "admin") { toast.error("Acceso no autorizado"); navigate("/login"); }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adelantoYaSession");
    toast.success("Sesión cerrada");
    navigate("/");
  };

  const handleSaveRisk = () => {
    toast.success("Configuración de riesgo guardada");
  };

  return (
    <div className="min-h-screen bg-surface-container-low">
      {/* Header */}
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
              {["Dashboard", "Empresas", "Configuración", "Reportes"].map((l) => (
                <button key={l} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  {l}
                </button>
              ))}
            </nav>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon"><Bell className="w-5 h-5" /></Button>
              <Button variant="ghost" size="icon"><Settings className="w-5 h-5" /></Button>
              <Button variant="ghost" size="icon" asChild><Link to="/"><Home className="w-5 h-5" /></Link></Button>
              <Button variant="ghost" size="icon" onClick={handleLogout}><LogOut className="w-5 h-5" /></Button>
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground text-xs font-bold ml-2">
                SA
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Title Section */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-headline text-3xl md:text-4xl font-extrabold text-foreground">Panel del Super Admin</h1>
            <p className="text-muted-foreground mt-1">
              Visión global de liquidez, riesgo y rendimiento corporativo de Adelanto Ya.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Operativo
            </span>
          </div>
        </div>

        {/* Fee Configuration */}
        <FeeConfigPanel />

        {/* KPI Cards */}
        <section>
          <h2 className="font-headline text-xl font-bold text-foreground mb-4">Indicadores Críticos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard
              icon={<BarChart3 className="w-5 h-5" />}
              label="Ratio Cobertura de Garantía"
              value={`${kpiData.collateralCoverage.toFixed(1)}x`}
              badge="META > 2.0x"
              badgeColor={kpiData.collateralCoverage >= 2 ? "bg-accent text-accent-foreground" : "bg-warning/10 text-warning"}
              status={kpiData.collateralCoverage >= 2 ? "success" : "warning"}
            />
            <KPICard
              icon={<AlertTriangle className="w-5 h-5" />}
              label="Tasa de Morosidad Real"
              value={formatPercent(kpiData.defaultRate)}
              badge="ALERTA > 4%"
              badgeColor={kpiData.defaultRate <= 0.04 ? "bg-accent text-accent-foreground" : "bg-destructive/10 text-destructive"}
              status={kpiData.defaultRate <= 0.04 ? "success" : "danger"}
            />
            <KPICard
              icon={<Activity className="w-5 h-5" />}
              label="Velocidad de Capital"
              value={`${kpiData.capitalVelocity.toFixed(1)} días`}
              badge="Óptimo < 15d"
              badgeColor={kpiData.capitalVelocity <= 15 ? "bg-accent text-accent-foreground" : "bg-warning/10 text-warning"}
              status={kpiData.capitalVelocity <= 15 ? "success" : "warning"}
            />
            <KPICard
              icon={<TrendingUp className="w-5 h-5" />}
              label="Tasa de Adopción"
              value={formatPercent(kpiData.adoptionRate)}
              badge="Meta > 60%"
              badgeColor={kpiData.adoptionRate >= 0.6 ? "bg-accent text-accent-foreground" : "bg-warning/10 text-warning"}
              status={kpiData.adoptionRate >= 0.6 ? "success" : "warning"}
            />
          </div>
        </section>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Beneficio Neto por Empresa */}
          <section className="lg:col-span-2 bg-surface-container-lowest rounded-2xl shadow-card p-6">
            <h3 className="font-headline text-lg font-bold text-foreground mb-4">Beneficio Neto por Empresa (RD$)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={companyProfitData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--outline-variant))" strokeOpacity={0.3} />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `${v / 1000}k`} />
                  <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} width={100} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "none", borderRadius: "12px", boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }} formatter={(value: number) => formatDOP(value)} />
                  <Bar dataKey="profit" fill="hsl(var(--primary))" name="Ganancia" radius={[0, 8, 8, 0]} />
                  <Bar dataKey="default" fill="hsl(var(--destructive))" name="Morosidad" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Distribución de Cartera — Donut */}
          <section className="bg-surface-container-lowest rounded-2xl shadow-card p-6">
            <h3 className="font-headline text-lg font-bold text-foreground mb-4">Distribución de Cartera</h3>
            <div className="h-48 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={portfolioData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    dataKey="value"
                    stroke="none"
                  >
                    {portfolioData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="font-headline text-2xl font-bold text-foreground">{portfolioData[0].value}%</p>
                <p className="text-xs text-muted-foreground">SEGURO</p>
              </div>
            </div>
            <div className="flex justify-center gap-4 mt-2">
              {portfolioData.map((d) => (
                <div key={d.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-xs text-muted-foreground">{d.name}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Trend Chart */}
        <section className="bg-surface-container-lowest rounded-2xl shadow-card p-6">
          <h3 className="font-headline text-lg font-bold text-foreground mb-4">Tendencia Mensual</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--outline-variant))" strokeOpacity={0.3} />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "none", borderRadius: "12px", boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }} formatter={(value: number) => formatDOP(value)} />
                <Line type="monotone" dataKey="disbursed" stroke="hsl(var(--primary))" strokeWidth={2} name="Desembolsado" dot={{ fill: "hsl(var(--primary))" }} />
                <Line type="monotone" dataKey="recovered" stroke="hsl(var(--secondary))" strokeWidth={2} name="Recuperado" dot={{ fill: "hsl(var(--secondary))" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Risk Configuration Panel */}
        <section className="bg-surface-container-lowest rounded-2xl shadow-card overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" />
                <h2 className="font-headline text-xl font-bold text-foreground">Configuración de Riesgo</h2>
              </div>
              <Button onClick={handleSaveRisk} size="sm">
                <Save className="w-4 h-4" />
                Guardar
              </Button>
            </div>
            <p className="text-muted-foreground mt-1">Ajusta los caps de riesgo que controlan los límites de adelanto.</p>
          </div>
          <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface-container-low rounded-2xl p-5 space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <Label className="text-sm">Safety Cap</Label>
                  <span className="text-sm font-bold text-foreground">{safetyCap}%</span>
                </div>
                <Slider value={[safetyCap]} onValueChange={([v]) => setSafetyCap(v)} min={10} max={100} step={5} />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <Label className="text-sm">Art. 201 Cap (fijo)</Label>
                  <span className="text-sm font-bold text-muted-foreground">30%</span>
                </div>
                <div className="h-2 rounded-full bg-surface-container-high">
                  <div className="h-full w-[30%] rounded-full bg-muted-foreground/50" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">No modificable — Código Laboral Art. 201</p>
              </div>
            </div>
            <div className="bg-surface-container-low rounded-2xl p-5 space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <Label className="text-sm">Tenure &lt;1 año</Label>
                  <span className="text-sm font-bold text-foreground">{tenureUnder1}%</span>
                </div>
                <Slider value={[tenureUnder1]} onValueChange={([v]) => setTenureUnder1(v)} min={5} max={50} step={5} />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <Label className="text-sm">Tenure 1-3 años</Label>
                  <span className="text-sm font-bold text-foreground">{tenure1to3}%</span>
                </div>
                <Slider value={[tenure1to3]} onValueChange={([v]) => setTenure1to3(v)} min={10} max={80} step={5} />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <Label className="text-sm">Tenure &gt;3 años</Label>
                  <span className="text-sm font-bold text-foreground">{tenureOver3}%</span>
                </div>
                <Slider value={[tenureOver3]} onValueChange={([v]) => setTenureOver3(v)} min={20} max={100} step={5} />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <Label className="text-sm">Max Concentración por Empresa</Label>
                  <span className="text-sm font-bold text-foreground">{maxConcentration}%</span>
                </div>
                <Slider value={[maxConcentration]} onValueChange={([v]) => setMaxConcentration(v)} min={5} max={25} step={1} />
              </div>
            </div>
          </div>
        </section>

        {/* Disbursement Queue */}
        <section className="bg-surface-container-lowest rounded-2xl shadow-card overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-headline text-xl font-bold text-foreground">Cola de Desembolsos Manuales</h2>
                <p className="text-muted-foreground">Transferencias aprobadas pendientes de ejecución</p>
              </div>
              <Badge variant="outline" className="text-primary border-primary">
                {pendingDisbursements.length} pendientes
              </Badge>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="bg-surface-container-low hover:bg-surface-container-low">
                <TableHead>Solicitante / Empresa</TableHead>
                <TableHead>Monto Solicitado</TableHead>
                <TableHead>Ratio Colateral</TableHead>
                <TableHead>Fecha Solicitud</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingDisbursements.map((item) => (
                <TableRow key={item.id} className="border-outline-variant/15">
                  <TableCell>
                    <div>
                      <p className="font-medium">{item.employee}</p>
                      <p className="text-xs text-muted-foreground">{item.company}</p>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">{formatDOP(item.amount)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 rounded-full bg-surface-container-high overflow-hidden">
                        <div
                          className={`h-full rounded-full ${item.collateralRatio >= 2 ? "bg-primary" : "bg-warning"}`}
                          style={{ width: `${Math.min(100, (item.collateralRatio / 6) * 100)}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{item.collateralRatio.toFixed(1)}x</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{item.requestDate}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="default" size="sm">
                      <CheckCircle2 className="w-4 h-4" />
                      Aprobar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>

        {/* Company Health */}
        <section className="bg-surface-container-lowest rounded-2xl shadow-card overflow-hidden">
          <div className="p-6">
            <h2 className="font-headline text-xl font-bold text-foreground">Salud de Empresas</h2>
            <p className="text-muted-foreground">Rentabilidad neta y alertas por cliente</p>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="bg-surface-container-low hover:bg-surface-container-low">
                <TableHead>Empresa</TableHead>
                <TableHead>Ganancia Neta</TableHead>
                <TableHead>Morosidad</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companyProfitData.map((company) => (
                <TableRow key={company.name} className="border-outline-variant/15">
                  <TableCell className="font-medium">{company.name}</TableCell>
                  <TableCell className="font-semibold text-primary">{formatDOP(company.profit)}</TableCell>
                  <TableCell className={company.default > 0 ? "text-destructive font-semibold" : "text-muted-foreground"}>
                    {formatDOP(company.default)}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={company.status as "healthy" | "warning" | "toxic"} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>
      </main>
    </div>
  );
}

function KPICard({
  icon,
  label,
  value,
  badge,
  badgeColor,
  status,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  badge: string;
  badgeColor: string;
  status: "success" | "warning" | "danger";
}) {
  const borderColors = {
    success: "border-l-primary",
    warning: "border-l-warning",
    danger: "border-l-destructive",
  };

  return (
    <div className={`bg-surface-container-lowest rounded-2xl p-5 shadow-card border-l-4 ${borderColors[status]}`}>
      <div className="flex items-center gap-2 text-muted-foreground mb-2">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <p className="font-headline text-3xl font-bold text-foreground mb-2">{value}</p>
      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${badgeColor}`}>
        {badge}
      </span>
    </div>
  );
}

function StatusBadge({ status }: { status: "healthy" | "warning" | "toxic" }) {
  const config = {
    healthy: { label: "Saludable", className: "bg-accent text-accent-foreground" },
    warning: { label: "Precaución", className: "bg-warning/10 text-warning" },
    toxic: { label: "Tóxico", className: "bg-destructive/10 text-destructive" },
  };
  return (
    <Badge variant="outline" className={config[status].className}>
      {config[status].label}
    </Badge>
  );
}
