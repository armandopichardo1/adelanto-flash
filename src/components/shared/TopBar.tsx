import { Home, LogOut } from "lucide-react";
import logoImage from "@/assets/logo-adelanto-ya.png";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface TopBarProps {
  subtitle: string;
  variant?: "employee" | "hr" | "admin";
  companyName?: string;
  children?: React.ReactNode;
}

export function TopBar({ subtitle, variant = "employee", companyName, children }: TopBarProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adelantoYaSession");
    toast.success("Sesión cerrada");
    navigate("/");
  };

  return (
    <header className="bg-surface-container-lowest sticky top-0 z-50 shadow-card">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center">
              <img src={logoImage} alt="Adelanto Ya" className="h-10 w-auto" />
            </Link>
            <div>
              <h1 className="font-headline font-bold text-foreground">Adelanto Ya</h1>
              <p className="text-xs text-muted-foreground">{companyName || subtitle}</p>
            </div>
          </div>
          {children}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/"><Home className="w-5 h-5" /></Link>
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
