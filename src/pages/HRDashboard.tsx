import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Wallet,
  Building2,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  Download,
  Search,
  UserPlus,
  Home,
  LogOut,
  Bell,
  Settings,
} from "lucide-react";
import { formatDOP } from "@/lib/advance-calculator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { CollateralCoverageChart } from "@/components/hr/CollateralCoverageChart";

const mockCompany = {
  name: "Tech Solutions SRL",
  rnc: "1-23-45678-9",
  totalEmployees: 45,
  activeUsers: 32,
  totalCollateral: 2500000,
};

const mockPendingRequests = [
  { id: 1, employee: "María García", cedula: "001-1234567-8", amount: 15000, requestDate: "2024-01-10", tenure: 2.5, avatar: "MG" },
  { id: 2, employee: "Juan Pérez", cedula: "002-9876543-2", amount: 8000, requestDate: "2024-01-10", tenure: 1.2, avatar: "JP" },
  { id: 3, employee: "Ana Rodríguez", cedula: "003-5555555-5", amount: 12000, requestDate: "2024-01-09", tenure: 4.1, avatar: "AR" },
];

const mockActiveAdvances = [
  { id: 1, employee: "Carlos Santos", cedula: "004-1111111-1", amount: 10000, totalToDeduct: 10200, disbursedDate: "2024-01-05", status: "active" },
  { id: 2, employee: "Laura Mejía", cedula: "005-2222222-2", amount: 5000, totalToDeduct: 5200, disbursedDate: "2024-01-03", status: "active" },
  { id: 3, employee: "Pedro Núñez", cedula: "006-3333333-3", amount: 20000, totalToDeduct: 20200, disbursedDate: "2024-01-01", status: "active" },
  { id: 4, employee: "Rosa Martínez", cedula: "007-4444444-4", amount: 8000, totalToDeduct: 8200, disbursedDate: "2024-01-02", status: "active" },
];

const mockEmployees = [
  { id: 1, name: "María García", cedula: "001-1234567-8", salary: 45000, tenure: 2.5, status: "ACTIVO" },
  { id: 2, name: "Juan Pérez", cedula: "002-9876543-2", salary: 35000, tenure: 1.2, status: "ACTIVO" },
  { id: 3, name: "Ana Rodríguez", cedula: "003-5555555-5", salary: 65000, tenure: 4.1, status: "ACTIVO" },
  { id: 4, name: "Carlos Santos", cedula: "004-1111111-1", salary: 40000, tenure: 3.0, status: "ACTIVO" },
  { id: 5, name: "Luisa Fernanda", cedula: "008-6666666-6", salary: 28000, tenure: 0.5, status: "INACTIVO" },
];

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

  const totalActiveAdvances = useMemo(() => mockActiveAdvances.reduce((s, a) => s + a.amount, 0), []);
  const adoptionRate = Math.round((mockCompany.activeUsers / mockCompany.totalEmployees) * 100);

  const handleExportPayroll = () => {
    const csvContent = [
      ["Cédula", "Concepto", "Monto"].join(","),
      ...mockActiveAdvances.map((a) => [a.cedula, "Adelanto Ya", a.totalToDeduct].join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nomina_adelanto_ya_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

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
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold ml-2">
                HR
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Title Section */}
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1">Panel de Control B2B</p>
          <h1 className="font-headline text-3xl md:text-4xl font-extrabold text-foreground">{mockCompany.name}</h1>
          <p className="text-muted-foreground mt-1 max-w-2xl">
            Gestiona adelantos de nómina y valida solicitudes de tus empleados en tiempo real.
          </p>
          <div className="flex gap-3 mt-4">
            <Button variant="default" onClick={handleExportPayroll}>
              <Download className="w-4 h-4" />
              Exportar para Nómina (CSV)
            </Button>
            <Button variant="outline">
              <UserPlus className="w-4 h-4" />
              Nuevo Empleado
            </Button>
          </div>
        </div>

        {/* Bento Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Total Adelantado — Large Card */}
          <div className="bg-gradient-to-br from-primary to-primary-container rounded-3xl p-6 text-primary-foreground relative overflow-hidden md:row-span-1">
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-primary-foreground/10 rounded-full blur-3xl" />
            <p className="text-primary-foreground/70 text-sm">Total Adelantado este Mes</p>
            <p className="font-headline text-4xl font-extrabold mt-2">{formatDOP(totalActiveAdvances)}</p>
            <div className="flex gap-6 mt-4 text-sm">
              <div>
                <p className="text-primary-foreground/70">Solicitudes</p>
                <p className="font-bold text-lg">{mockActiveAdvances.length}</p>
              </div>
              <div>
                <p className="text-primary-foreground/70">Pendientes</p>
                <p className="font-bold text-lg">{mockPendingRequests.length}</p>
              </div>
            </div>
          </div>

          {/* Empleados Activos */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-card">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Empleados Activos</span>
            </div>
            <p className="font-headline text-4xl font-extrabold text-foreground">{mockCompany.activeUsers}</p>
            <p className="text-xs text-muted-foreground mt-1">de {mockCompany.totalEmployees} registrados</p>
            <div className="mt-3">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Tasa de adopción</span>
                <span className="font-semibold text-foreground">{adoptionRate}%</span>
              </div>
              <Progress value={adoptionRate} className="h-2" />
            </div>
          </div>

          {/* Collateral Coverage */}
          <CollateralCoverageChart totalCollateral={mockCompany.totalCollateral} totalActiveAdvances={totalActiveAdvances} />
        </div>

        {/* Two-Column: Action Center + Employee List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Action Center — Pending Requests */}
          <section className="bg-surface-container-lowest rounded-2xl shadow-card">
            <div className="p-6 flex items-center justify-between">
              <div>
                <h2 className="font-headline text-lg font-bold text-foreground">Centro de Acción</h2>
                <p className="text-muted-foreground text-sm">Solicitudes pendientes de validación</p>
              </div>
              <Badge variant="outline" className="border-primary text-primary">
                {mockPendingRequests.length} Pendientes
              </Badge>
            </div>
            <div className="px-6 pb-6 space-y-3">
              {mockPendingRequests.map((req) => (
                <div key={req.id} className="flex items-center gap-4 bg-surface-container-low rounded-2xl p-4">
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-primary font-bold text-sm">
                    {req.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{req.employee}</p>
                    <p className="text-xs text-muted-foreground">{req.cedula} · {req.tenure} años</p>
                  </div>
                  <p className="font-headline font-bold text-foreground whitespace-nowrap">{formatDOP(req.amount)}</p>
                  <div className="flex gap-2">
                    <Button variant="default" size="sm" className="h-8">
                      <CheckCircle2 className="w-4 h-4" />
                      Validar
                    </Button>
                    <Button variant="outline" size="sm" className="h-8">
                      <XCircle className="w-4 h-4" />
                    </Button>
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
                  <Input
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-48"
                  />
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
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockEmployees
                  .filter((e) =>
                    e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    e.cedula.includes(searchTerm)
                  )
                  .map((emp) => (
                    <TableRow key={emp.id} className="border-outline-variant/15">
                      <TableCell className="font-medium">{emp.name}</TableCell>
                      <TableCell className="font-mono text-sm">{emp.cedula}</TableCell>
                      <TableCell>{formatDOP(emp.salary)}</TableCell>
                      <TableCell>{emp.tenure} años</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            emp.status === "ACTIVO"
                              ? "bg-accent text-accent-foreground"
                              : "bg-surface-container text-muted-foreground"
                          }
                        >
                          {emp.status}
                        </Badge>
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
