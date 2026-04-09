import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Wallet, 
  Building2, 
  Users, 
  Clock,
  CheckCircle2,
  XCircle,
  Download,
  Search,
  Filter,
  Home,
  LogOut
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
  { id: 1, employee: "María García", cedula: "001-1234567-8", amount: 15000, requestDate: "2024-01-10", tenure: 2.5 },
  { id: 2, employee: "Juan Pérez", cedula: "002-9876543-2", amount: 8000, requestDate: "2024-01-10", tenure: 1.2 },
  { id: 3, employee: "Ana Rodríguez", cedula: "003-5555555-5", amount: 12000, requestDate: "2024-01-09", tenure: 4.1 },
];

const mockActiveAdvances = [
  { id: 1, employee: "Carlos Santos", cedula: "004-1111111-1", amount: 10000, totalToDeduct: 10200, disbursedDate: "2024-01-05", status: "active" },
  { id: 2, employee: "Laura Mejía", cedula: "005-2222222-2", amount: 5000, totalToDeduct: 5200, disbursedDate: "2024-01-03", status: "active" },
  { id: 3, employee: "Pedro Núñez", cedula: "006-3333333-3", amount: 20000, totalToDeduct: 20200, disbursedDate: "2024-01-01", status: "active" },
  { id: 4, employee: "Rosa Martínez", cedula: "007-4444444-4", amount: 8000, totalToDeduct: 8200, disbursedDate: "2024-01-02", status: "active" },
];

export default function HRDashboard() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const session = localStorage.getItem("adelantoYaSession");
    if (!session) {
      navigate("/login");
      return;
    }
    const parsed = JSON.parse(session);
    if (parsed.type !== "hr") {
      toast.error("Acceso no autorizado");
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adelantoYaSession");
    toast.success("Sesión cerrada");
    navigate("/");
  };

  const filteredRequests = mockPendingRequests.filter(req =>
    req.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.cedula.includes(searchTerm)
  );

  const totalActiveAdvances = useMemo(() => 
    mockActiveAdvances.reduce((sum, adv) => sum + adv.amount, 0),
    []
  );

  const handleExportPayroll = () => {
    const csvContent = [
      ["Cédula", "Concepto", "Monto"].join(","),
      ...mockActiveAdvances.map(adv => 
        [adv.cedula, "Adelanto Ya", adv.totalToDeduct].join(",")
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nomina_adelanto_ya_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
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
                <p className="text-xs text-primary-foreground/70">Panel de RRHH</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                <span className="font-medium hidden sm:inline">{mockCompany.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild className="text-primary-foreground hover:bg-primary-foreground/10">
                  <Link to="/">
                    <Home className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Inicio</span>
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="text-primary-foreground hover:bg-primary-foreground/10">
                  <LogOut className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Salir</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            icon={<Users className="w-5 h-5" />}
            label="Empleados Activos"
            value={mockCompany.activeUsers.toString()}
            sublabel={`de ${mockCompany.totalEmployees} registrados`}
            color="bg-primary"
          />
          <StatCard
            icon={<Clock className="w-5 h-5" />}
            label="Solicitudes Pendientes"
            value={mockPendingRequests.length.toString()}
            sublabel="Requieren aprobación"
            color="bg-warning"
          />
          <StatCard
            icon={<CheckCircle2 className="w-5 h-5" />}
            label="Adelantos Activos"
            value={mockActiveAdvances.length.toString()}
            sublabel="En período de cobro"
            color="bg-primary"
          />
          <StatCard
            icon={<Wallet className="w-5 h-5" />}
            label="Total Adelantado"
            value={formatDOP(totalActiveAdvances)}
            sublabel="Este mes"
            color="bg-secondary"
          />
        </div>

        {/* Collateral Coverage Chart */}
        <CollateralCoverageChart 
          totalCollateral={mockCompany.totalCollateral}
          totalActiveAdvances={totalActiveAdvances}
        />

        {/* Pending Requests */}
        <section className="bg-surface-container-lowest rounded-2xl shadow-card overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="font-headline text-xl font-bold text-foreground">Solicitudes Pendientes</h2>
                <p className="text-muted-foreground">Adelantos que requieren validación de RRHH</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nombre o cédula..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="bg-surface-container-low hover:bg-surface-container-low">
                <TableHead>Empleado</TableHead>
                <TableHead>Cédula</TableHead>
                <TableHead>Antigüedad</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((request) => (
                <TableRow key={request.id} className="border-outline-variant/15">
                  <TableCell className="font-medium">{request.employee}</TableCell>
                  <TableCell className="font-mono text-sm">{request.cedula}</TableCell>
                  <TableCell>{request.tenure} años</TableCell>
                  <TableCell className="font-semibold">{formatDOP(request.amount)}</TableCell>
                  <TableCell className="text-muted-foreground">{request.requestDate}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="default" size="sm">
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        Aprobar
                      </Button>
                      <Button variant="outline" size="sm">
                        <XCircle className="w-4 h-4 mr-1" />
                        Rechazar
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredRequests.length === 0 && (
            <div className="p-12 text-center">
              <Clock className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">No hay solicitudes pendientes</p>
            </div>
          )}
        </section>

        {/* Active Advances */}
        <section className="bg-surface-container-lowest rounded-2xl shadow-card overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="font-headline text-xl font-bold text-foreground">Adelantos Activos</h2>
                <p className="text-muted-foreground">Descuentos programados para próxima nómina</p>
              </div>
              <Button variant="default" onClick={handleExportPayroll}>
                <Download className="w-4 h-4 mr-2" />
                Exportar a Nómina (CSV)
              </Button>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="bg-surface-container-low hover:bg-surface-container-low">
                <TableHead>Empleado</TableHead>
                <TableHead>Cédula</TableHead>
                <TableHead>Monto Adelantado</TableHead>
                <TableHead>Total a Descontar</TableHead>
                <TableHead>Fecha Desembolso</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockActiveAdvances.map((adv) => (
                <TableRow key={adv.id} className="border-outline-variant/15">
                  <TableCell className="font-medium">{adv.employee}</TableCell>
                  <TableCell className="font-mono text-sm">{adv.cedula}</TableCell>
                  <TableCell>{formatDOP(adv.amount)}</TableCell>
                  <TableCell className="font-semibold">{formatDOP(adv.totalToDeduct)}</TableCell>
                  <TableCell className="text-muted-foreground">{adv.disbursedDate}</TableCell>
                  <TableCell>
                    <Badge variant="default" className="bg-accent text-accent-foreground hover:bg-accent/80">
                      Activo
                    </Badge>
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

function StatCard({
  icon,
  label,
  value,
  sublabel,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sublabel: string;
  color: string;
}) {
  return (
    <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-card">
      <div className={`inline-flex items-center justify-center w-10 h-10 rounded-2xl ${color} text-primary-foreground mb-3`}>
        {icon}
      </div>
      <p className="font-headline text-2xl font-bold text-foreground mb-1">{value}</p>
      <p className="text-sm font-medium text-foreground">{label}</p>
      <p className="text-xs text-muted-foreground">{sublabel}</p>
    </div>
  );
}
