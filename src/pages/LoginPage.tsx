import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wallet, ArrowLeft, Mail, Lock, Eye, EyeOff, Building2, User } from "lucide-react";
import { toast } from "sonner";

type LoginType = "employee" | "hr" | "admin";

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loginType, setLoginType] = useState<LoginType>((searchParams.get("type") as LoginType) || "employee");
  const [companyCode, setCompanyCode] = useState("");
  const [cedula, setCedula] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      if (loginType === "employee") {
        localStorage.setItem("adelantoYaSession", JSON.stringify({
          type: "employee",
          companyCode,
          cedula,
          name: "María García",
          company: "Tech Solutions SRL",
        }));
        toast.success("¡Bienvenido!");
        navigate("/employee");
      } else if (loginType === "hr") {
        localStorage.setItem("adelantoYaSession", JSON.stringify({
          type: "hr",
          email,
          company: "Tech Solutions SRL",
        }));
        toast.success("¡Bienvenido al Panel de RRHH!");
        navigate("/hr");
      } else {
        localStorage.setItem("adelantoYaSession", JSON.stringify({
          type: "admin",
          email,
        }));
        toast.success("¡Bienvenido al Panel de Administración!");
        navigate("/admin");
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-surface-container-low flex flex-col">
      {/* Header */}
      <header className="bg-surface-container-lowest shadow-card">
        <div className="container mx-auto px-4 py-4">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-12 h-12 rounded-2xl gradient-hero flex items-center justify-center shadow-button">
                <Wallet className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="font-headline text-2xl font-bold text-foreground">Adelanto Ya</span>
            </Link>
            <h1 className="font-headline text-2xl font-bold text-foreground mb-2">Iniciar Sesión</h1>
            <p className="text-muted-foreground">Accede a tu cuenta para solicitar adelantos</p>
          </div>

          {/* Login Type Tabs */}
          <div className="bg-surface-container rounded-2xl p-2 mb-4">
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setLoginType("employee")}
                className={`py-3 px-4 rounded-xl text-sm font-medium transition-colors ${
                  loginType === "employee"
                    ? "bg-primary text-primary-foreground shadow-button"
                    : "text-muted-foreground hover:bg-surface-container-low"
                }`}
              >
                <User className="w-4 h-4 mx-auto mb-1" />
                Empleado
              </button>
              <button
                type="button"
                onClick={() => setLoginType("hr")}
                className={`py-3 px-4 rounded-xl text-sm font-medium transition-colors ${
                  loginType === "hr"
                    ? "bg-primary text-primary-foreground shadow-button"
                    : "text-muted-foreground hover:bg-surface-container-low"
                }`}
              >
                <Building2 className="w-4 h-4 mx-auto mb-1" />
                RRHH
              </button>
              <button
                type="button"
                onClick={() => setLoginType("admin")}
                className={`py-3 px-4 rounded-xl text-sm font-medium transition-colors ${
                  loginType === "admin"
                    ? "bg-primary text-primary-foreground shadow-button"
                    : "text-muted-foreground hover:bg-surface-container-low"
                }`}
              >
                <Wallet className="w-4 h-4 mx-auto mb-1" />
                Admin
              </button>
            </div>
          </div>

          {/* Login Form */}
          <div className="bg-surface-container-lowest rounded-2xl shadow-card p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {loginType === "employee" ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="companyCode">Código de Empresa</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="companyCode"
                        type="text"
                        placeholder="Ej: TECH-001"
                        value={companyCode}
                        onChange={(e) => setCompanyCode(e.target.value.toUpperCase())}
                        className="pl-10 uppercase"
                        required
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Solicita el código a tu departamento de RRHH
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cedula">Cédula</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="cedula"
                        type="text"
                        placeholder="000-0000000-0"
                        value={cedula}
                        onChange={(e) => setCedula(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo electrónico</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="tu@empresa.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Contraseña</Label>
                  <a href="#" className="text-sm text-primary hover:underline">
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>
            </form>

            {loginType === "employee" && (
              <div className="mt-6 text-center">
                <p className="text-muted-foreground text-sm">
                  ¿Tu empresa no está registrada?{" "}
                  <Link to="/#empresas" className="text-primary hover:underline font-medium">
                    Invítalos aquí
                  </Link>
                </p>
              </div>
            )}

            {/* Quick Demo Access */}
            <div className="mt-8 pt-6 border-t border-outline-variant/20">
              <p className="text-xs text-muted-foreground text-center mb-3">Acceso rápido (demo)</p>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  type="button"
                  variant="soft"
                  size="sm"
                  className="text-xs"
                  onClick={() => {
                    localStorage.setItem("adelantoYaSession", JSON.stringify({
                      type: "employee",
                      companyCode: "TECH-001",
                      cedula: "001-1234567-8",
                      name: "María García",
                      company: "Tech Solutions SRL",
                    }));
                    toast.success("¡Bienvenido, María!");
                    navigate("/employee");
                  }}
                >
                  <User className="w-3 h-3" />
                  Empleado
                </Button>
                <Button
                  type="button"
                  variant="soft"
                  size="sm"
                  className="text-xs"
                  onClick={() => {
                    localStorage.setItem("adelantoYaSession", JSON.stringify({
                      type: "hr",
                      email: "rrhh@techsolutions.com",
                      company: "Tech Solutions SRL",
                    }));
                    toast.success("¡Bienvenido al Panel de RRHH!");
                    navigate("/hr");
                  }}
                >
                  <Building2 className="w-3 h-3" />
                  RRHH
                </Button>
                <Button
                  type="button"
                  variant="soft"
                  size="sm"
                  className="text-xs"
                  onClick={() => {
                    localStorage.setItem("adelantoYaSession", JSON.stringify({
                      type: "admin",
                      email: "admin@adelantoya.com",
                    }));
                    toast.success("¡Bienvenido al Panel de Admin!");
                    navigate("/admin");
                  }}
                >
                  <Wallet className="w-3 h-3" />
                  Admin
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
