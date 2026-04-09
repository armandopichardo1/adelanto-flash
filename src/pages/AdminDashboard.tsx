import { useEffect } from "react";
import { FeeConfigPanel } from "@/components/admin/FeeConfigPanel";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Wallet,
  Settings,
  Building2,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  DollarSign,
  BarChart3,
  Activity,
  Home,
  LogOut,
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

const pendingDisbursements = [
  { id: 1, employee: "María García", company: "Tech Solutions", amount: 15000, bankAccount: "823-456789-1", status: "approved" },
  { id: 2, employee: "Juan Pérez", company: "Grupo ABC", amount: 8000, bankAccount: "412-987654-3", status: "approved" },
  { id: 3, employee: "Ana Rodríguez", company: "Tech Solutions", amount: 12000, bankAccount: "156-555555-5", status: "approved" },
];

export default function AdminDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const session = localStorage.getItem("adelantoYaSession");
    if (!session) {
      navigate("/login");
      return;
    }
    const parsed = JSON.parse(session);
    if (parsed.type !== "admin") {
      toast.error("Acceso no autorizado");
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adelantoYaSession");
    toast.success("Sesión cerrada");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-surface-container-low">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-primary-container text-primary-foreground">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/" className="w-10 h-10 rounded-2xl bg-primary-foreground/20 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-primary-foreground" />
              </Link>
              <div>
                <h1 className="font-headline font-bold">Adelanto Ya</h1>
                <p className="text-xs text-primary-foreground/70">Panel de Administración</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild className="text-primary-foreground hover:bg-primary-foreground/10">
                <Link to="/">
                  <Home className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Inicio</span>
                </Link>
              </Button>
              <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10">
                <Settings className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Configuración</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-primary-foreground hover:bg-primary-foreground/10">
                <LogOut className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Salir</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Fee Configuration */}
        <FeeConfigPanel />

        {/* Critical KPIs */}
        <section>
          <h2 className="font-headline text-xl font-bold text-foreground mb-4">Indicadores Críticos</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <KPICard
              icon={<BarChart3 className="w-5 h-5" />}
              label="Cobertura de Garantía"
              value={`${kpiData.collateralCoverage.toFixed(1)}x`}
              target="Meta: > 2.0x"
              status={kpiData.collateralCoverage >= 2 ? "success" : "warning"}
              description="Respaldo / Saldo Activo"
            />
            <KPICard
              icon={<AlertTriangle className="w-5 h-5" />}
              label="Tasa de Morosidad"
              value={formatPercent(kpiData.defaultRate)}
              target="Alerta si > 4%"
              status={kpiData.defaultRate <= 0.04 ? "success" : "danger"}
              description="Adelantos +30 días vencidos"
            />
            <KPICard
              icon={<Activity className="w-5 h-5" />}
              label="Velocidad de Capital"
              value={`${kpiData.capitalVelocity.toFixed(1)} días`}
              target="Óptimo: < 15 días"
              status={kpiData.capitalVelocity <= 15 ? "success" : "warning"}
              description="Solicitud a Cobro"
            />
            <KPICard
              icon={<TrendingUp className="w-5 h-5" />}
              label="Tasa de Adopción"
              value={formatPercent(kpiData.adoptionRate)}
              target="Meta: > 60%"
              status={kpiData.adoptionRate >= 0.6 ? "success" : "warning"}
              description="Empleados activos/mes"
            />
            <KPICard
              icon={<DollarSign className="w-5 h-5" />}
              label="Saldo Activo Total"
              value={formatDOP(kpiData.totalActivePending)}
              target={`Respaldo: ${formatDOP(kpiData.totalCollateralHeld)}`}
              status="neutral"
              description="Monto pendiente actual"
            />
          </div>
        </section>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section className="bg-surface-container-lowest rounded-2xl shadow-card p-6">
            <h3 className="font-headline text-lg font-bold text-foreground mb-4">Tendencia Mensual</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--outline-variant))" strokeOpacity={0.3} />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `${v/1000}k`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "none",
                      borderRadius: "12px",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                    }}
                    formatter={(value: number) => formatDOP(value)}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="disbursed" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    name="Desembolsado"
                    dot={{ fill: "hsl(var(--primary))" }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="recovered" 
                    stroke="hsl(var(--secondary))" 
                    strokeWidth={2}
                    name="Recuperado"
                    dot={{ fill: "hsl(var(--secondary))" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="bg-surface-container-lowest rounded-2xl shadow-card p-6">
            <h3 className="font-headline text-lg font-bold text-foreground mb-4">Rentabilidad por Empresa</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={companyProfitData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--outline-variant))" strokeOpacity={0.3} />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `${v/1000}k`} />
                  <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} width={100} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "none",
                      borderRadius: "12px",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                    }}
                    formatter={(value: number) => formatDOP(value)}
                  />
                  <Bar dataKey="profit" fill="hsl(var(--primary))" name="Ganancia" radius={[0, 8, 8, 0]} />
                  <Bar dataKey="default" fill="hsl(var(--destructive))" name="Morosidad" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>

        {/* Manual Disbursement Queue */}
        <section className="bg-surface-container-lowest rounded-2xl shadow-card overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-headline text-xl font-bold text-foreground">Cola de Desembolso Manual</h2>
                <p className="text-muted-foreground">Transferencias pendientes de ejecución</p>
              </div>
              <Badge variant="outline" className="text-primary border-primary">
                {pendingDisbursements.length} pendientes
              </Badge>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="bg-surface-container-low hover:bg-surface-container-low">
                <TableHead>Empleado</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Cuenta Bancaria</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingDisbursements.map((item) => (
                <TableRow key={item.id} className="border-outline-variant/15">
                  <TableCell className="font-medium">{item.employee}</TableCell>
                  <TableCell>{item.company}</TableCell>
                  <TableCell className="font-semibold">{formatDOP(item.amount)}</TableCell>
                  <TableCell className="font-mono text-sm">{item.bankAccount}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-accent text-accent-foreground">
                      <Clock className="w-3 h-3 mr-1" />
                      Aprobado
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="default" size="sm">
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      Marcar Pagado
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
  target,
  status,
  description,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  target: string;
  status: "success" | "warning" | "danger" | "neutral";
  description: string;
}) {
  const statusColors = {
    success: "border-l-primary",
    warning: "border-l-warning",
    danger: "border-l-destructive",
    neutral: "border-l-muted-foreground",
  };

  return (
    <div className={`bg-surface-container-lowest rounded-2xl p-5 shadow-card border-l-4 ${statusColors[status]}`}>
      <div className="flex items-center gap-2 text-muted-foreground mb-2">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <p className="font-headline text-2xl font-bold text-foreground mb-1">{value}</p>
      <p className="text-xs text-muted-foreground mb-1">{description}</p>
      <p className="text-xs font-medium text-primary">{target}</p>
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
