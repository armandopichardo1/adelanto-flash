import { useState, useEffect } from "react";
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
import { formatDOP } from "@/lib/loan-calculator";
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

// Mock data
const mockCompany = {
  name: "Tech Solutions SRL",
  rnc: "1-23-45678-9",
  totalEmployees: 45,
  activeUsers: 32,
};

const mockPendingRequests = [
  { id: 1, employee: "María García", cedula: "001-1234567-8", amount: 15000, requestDate: "2024-01-10", tenure: 2.5 },
  { id: 2, employee: "Juan Pérez", cedula: "002-9876543-2", amount: 8000, requestDate: "2024-01-10", tenure: 1.2 },
  { id: 3, employee: "Ana Rodríguez", cedula: "003-5555555-5", amount: 12000, requestDate: "2024-01-09", tenure: 4.1 },
];

const mockActiveLoans = [
  { id: 1, employee: "Carlos Santos", cedula: "004-1111111-1", amount: 10000, totalDebt: 10700, disbursedDate: "2024-01-05", status: "active" },
  { id: 2, employee: "Laura Mejía", cedula: "005-2222222-2", amount: 5000, totalDebt: 5350, disbursedDate: "2024-01-03", status: "active" },
];

export default function HRDashboard() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const session = localStorage.getItem("dineroYaSession");
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
    localStorage.removeItem("dineroYaSession");
    toast.success("Sesión cerrada");
    navigate("/");
  };

  const filteredRequests = mockPendingRequests.filter(req =>
    req.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.cedula.includes(searchTerm)
  );

  const handleExportPayroll = () => {
    // Generate CSV content
    const csvContent = [
      ["Cédula", "Concepto", "Monto"].join(","),
      ...mockActiveLoans.map(loan => 
        [loan.cedula, "Adelanto Dinero Ya", loan.totalDebt].join(",")
      )
    ].join("\n");

    // Download
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nomina_dinero_ya_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-secondary text-secondary-foreground">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/" className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Wallet className="w-5 h-5 text-primary-foreground" />
              </Link>
              <div>
                <h1 className="font-bold">Dinero Ya</h1>
                <p className="text-xs text-secondary-foreground/70">Panel de RRHH</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                <span className="font-medium hidden sm:inline">{mockCompany.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild className="text-secondary-foreground">
                  <Link to="/">
                    <Home className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Inicio</span>
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="text-secondary-foreground">
                  <LogOut className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Salir</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
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
            value={mockActiveLoans.length.toString()}
            sublabel="En período de cobro"
            color="bg-primary"
          />
          <StatCard
            icon={<Wallet className="w-5 h-5" />}
            label="Total Adelantado"
            value={formatDOP(mockActiveLoans.reduce((sum, l) => sum + l.amount, 0))}
            sublabel="Este mes"
            color="bg-secondary"
          />
        </div>

        {/* Pending Requests Section */}
        <section className="bg-background rounded-2xl shadow-soft overflow-hidden">
          <div className="p-6 border-b border-border">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-foreground">Solicitudes Pendientes</h2>
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
              <TableRow>
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
                <TableRow key={request.id}>
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

        {/* Active Loans Section */}
        <section className="bg-background rounded-2xl shadow-soft overflow-hidden">
          <div className="p-6 border-b border-border">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-foreground">Adelantos Activos</h2>
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
              <TableRow>
                <TableHead>Empleado</TableHead>
                <TableHead>Cédula</TableHead>
                <TableHead>Monto Adelantado</TableHead>
                <TableHead>Total a Descontar</TableHead>
                <TableHead>Fecha Desembolso</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockActiveLoans.map((loan) => (
                <TableRow key={loan.id}>
                  <TableCell className="font-medium">{loan.employee}</TableCell>
                  <TableCell className="font-mono text-sm">{loan.cedula}</TableCell>
                  <TableCell>{formatDOP(loan.amount)}</TableCell>
                  <TableCell className="font-semibold">{formatDOP(loan.totalDebt)}</TableCell>
                  <TableCell className="text-muted-foreground">{loan.disbursedDate}</TableCell>
                  <TableCell>
                    <Badge variant="default" className="bg-primary/10 text-primary hover:bg-primary/20">
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
    <div className="bg-background rounded-xl p-5 shadow-soft">
      <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${color} text-primary-foreground mb-3`}>
        {icon}
      </div>
      <p className="text-2xl font-bold text-foreground mb-1">{value}</p>
      <p className="text-sm font-medium text-foreground">{label}</p>
      <p className="text-xs text-muted-foreground">{sublabel}</p>
    </div>
  );
}
