import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, User, Building2, CreditCard, Shield, MessageCircle, HelpCircle, LogOut } from "lucide-react";
import { currentEmployee } from "@/lib/mock-data";
import { BottomNav } from "@/components/shared/BottomNav";
import { toast } from "sonner";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [whatsappEnabled, setWhatsappEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("adelantoYaSession");
    toast.success("Sesión cerrada");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-surface-container-low pb-28">
      <header className="bg-surface-container-lowest sticky top-0 z-50 shadow-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/employee")} className="p-2 rounded-xl hover:bg-surface-container-low transition-colors">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <h1 className="font-headline font-bold text-foreground">Mi Perfil</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-lg space-y-4">
        {/* Avatar + Name */}
        <div className="bg-surface-container-lowest rounded-2xl shadow-card p-6 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="font-headline text-2xl font-bold text-primary">
              {currentEmployee.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
            </span>
          </div>
          <div>
            <p className="font-headline font-bold text-lg text-foreground">{currentEmployee.name}</p>
            <p className="text-sm text-muted-foreground">{currentEmployee.company}</p>
          </div>
        </div>

        {/* Personal Data */}
        <Section icon={User} title="Datos Personales">
          <InfoRow label="Nombre" value={currentEmployee.name} />
          <InfoRow label="Cédula" value={currentEmployee.cedula} />
          <InfoRow label="Fecha de Nacimiento" value={new Intl.DateTimeFormat("es-DO", { dateStyle: "long" }).format(new Date(currentEmployee.birthDate))} />
          <InfoRow label="Correo" value={currentEmployee.email} />
          <InfoRow label="Teléfono" value={currentEmployee.phone} />
        </Section>

        {/* Company */}
        <Section icon={Building2} title="Empresa">
          <InfoRow label="Empresa" value={currentEmployee.company} />
          <InfoRow label="Departamento" value={currentEmployee.department} />
          <InfoRow label="Fecha de Ingreso" value={String(currentEmployee.joinYear)} />
          <InfoRow label="Antigüedad" value={`${currentEmployee.tenureYears} años`} />
        </Section>

        {/* Bank */}
        <Section icon={CreditCard} title="Cuenta Bancaria">
          <InfoRow label="Banco" value={currentEmployee.bankName} />
          <InfoRow label="Tipo" value={currentEmployee.bankAccountType} />
          <InfoRow label="Cuenta" value={currentEmployee.bankAccountNumber} />
        </Section>

        {/* Security & Notifications */}
        <Section icon={Shield} title="Seguridad y Notificaciones">
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-foreground">Acceso biométrico</p>
              <p className="text-xs text-muted-foreground">Huella o Face ID</p>
            </div>
            <Switch checked={biometricEnabled} onCheckedChange={setBiometricEnabled} />
          </div>
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-green-600" />
              <div>
                <p className="text-sm font-medium text-foreground">Notificaciones WhatsApp</p>
                <p className="text-xs text-muted-foreground">Recibe alertas de tus adelantos</p>
              </div>
            </div>
            <Switch checked={whatsappEnabled} onCheckedChange={setWhatsappEnabled} />
          </div>
        </Section>

        {/* Support link */}
        <button
          onClick={() => navigate("/support")}
          className="w-full bg-surface-container-lowest rounded-2xl shadow-card p-5 flex items-center gap-3 hover:bg-surface-container-low transition-colors"
        >
          <HelpCircle className="w-5 h-5 text-primary" />
          <span className="font-medium text-foreground text-sm">Soporte y Ayuda</span>
        </button>

        {/* Logout */}
        <Button variant="outline" size="lg" className="w-full text-destructive border-destructive/20 hover:bg-destructive/5" onClick={handleLogout}>
          <LogOut className="w-5 h-5" /> Cerrar Sesión
        </Button>
      </main>

      <BottomNav activeTab="profile" />
    </div>
  );
}

function Section({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-surface-container-lowest rounded-2xl shadow-card overflow-hidden">
      <div className="px-5 pt-5 pb-2 flex items-center gap-2">
        <Icon className="w-5 h-5 text-primary" />
        <h3 className="font-headline font-semibold text-foreground">{title}</h3>
      </div>
      <div className="px-5 pb-5 divide-y divide-outline-variant/10">{children}</div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}
