import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CheckCircle2, AlertCircle, Search } from "lucide-react";
import { mockEmployers } from "@/lib/mock-data";
import { toast } from "sonner";

export default function EligibilityCheck() {
  const navigate = useNavigate();
  const [cedula, setCedula] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [codigoEmpleado, setCodigoEmpleado] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const filteredEmployers = mockEmployers.filter((e) =>
    e.name.toLowerCase().includes(empresa.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cedula || !empresa || !birthDate) {
      toast.error("Completa todos los campos requeridos");
      return;
    }
    setStatus("loading");
    setTimeout(() => {
      const found = mockEmployers.some((emp) =>
        emp.name.toLowerCase() === empresa.toLowerCase()
      );
      setStatus(found ? "success" : "error");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-surface-container-low">
      <header className="bg-surface-container-lowest sticky top-0 z-50 shadow-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/splash")} className="p-2 rounded-xl hover:bg-surface-container-low transition-colors">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <h1 className="font-headline font-bold text-foreground">Verifica tu elegibilidad</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-lg">
        <div className="bg-surface-container-lowest rounded-3xl shadow-card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="cedula">Cédula</Label>
              <Input
                id="cedula"
                placeholder="000-0000000-0"
                value={cedula}
                onChange={(e) => setCedula(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2 relative">
              <Label htmlFor="empresa">Empresa</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="empresa"
                  placeholder="Busca tu empresa"
                  value={empresa}
                  onChange={(e) => { setEmpresa(e.target.value); setSearchOpen(true); }}
                  onFocus={() => setSearchOpen(true)}
                  className="pl-10"
                  required
                />
              </div>
              {searchOpen && empresa.length > 0 && filteredEmployers.length > 0 && (
                <div className="absolute z-10 w-full bg-surface-container-lowest rounded-xl shadow-card border border-outline-variant/20 mt-1 max-h-40 overflow-y-auto">
                  {filteredEmployers.map((emp) => (
                    <button
                      key={emp.id}
                      type="button"
                      className="w-full text-left px-4 py-3 hover:bg-surface-container-low transition-colors text-sm text-foreground"
                      onClick={() => { setEmpresa(emp.name); setSearchOpen(false); }}
                    >
                      {emp.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="codigoEmpleado">Correo corporativo o código de empleado</Label>
              <Input
                id="codigoEmpleado"
                placeholder="Ej: maria.perez@empresa.com"
                value={codigoEmpleado}
                onChange={(e) => setCodigoEmpleado(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthDate">Fecha de nacimiento</Label>
              <Input
                id="birthDate"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                required
              />
            </div>

            {status === "idle" || status === "loading" ? (
              <Button type="submit" className="w-full" size="lg" disabled={status === "loading"}>
                {status === "loading" ? "Verificando..." : "Continuar"}
              </Button>
            ) : null}
          </form>

          {status === "success" && (
            <div className="mt-6 bg-accent rounded-2xl p-6 text-center">
              <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-3" />
              <p className="font-headline font-bold text-foreground text-lg">¡Tu empresa está afiliada!</p>
              <p className="text-muted-foreground text-sm mt-1">Puedes continuar con tu registro</p>
              <Button variant="flash" size="lg" className="w-full mt-4" onClick={() => navigate("/login?type=employee")}>
                Continuar al registro
              </Button>
            </div>
          )}

          {status === "error" && (
            <div className="mt-6 bg-error-container rounded-2xl p-6 text-center">
              <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-3" />
              <p className="font-headline font-bold text-foreground text-lg">Estamos validando tu información</p>
              <p className="text-muted-foreground text-sm mt-1">Te notificaremos cuando tu empresa sea afiliada</p>
              <Button variant="soft" size="lg" className="w-full mt-4" onClick={() => navigate("/splash")}>
                Volver al inicio
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
