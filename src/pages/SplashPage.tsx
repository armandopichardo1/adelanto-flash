import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logoImg from "@/assets/logo-adelanto-ya-transparent.png";

export default function SplashPage() {
  return (
    <div className="min-h-screen bg-surface-container-low flex flex-col items-center justify-center px-6">
      <div className="flex-1 flex flex-col items-center justify-center max-w-sm w-full">
        <img src={logoImg} alt="Adelanto Ya" className="h-16 mb-8" />

        <p className="text-center text-muted-foreground text-lg leading-relaxed mb-12 font-body">
          Accede a tu adelanto por nómina de forma rápida y segura
        </p>

        <div className="w-full space-y-3">
          <Button variant="flash" size="xl" className="w-full" asChild>
            <Link to="/eligibility">Comenzar</Link>
          </Button>
          <Button variant="soft" size="lg" className="w-full" asChild>
            <Link to="/login">Ya tengo cuenta</Link>
          </Button>
        </div>
      </div>

      <p className="text-xs text-muted-foreground pb-8 mt-8">
        Un beneficio para ti y tu empresa
      </p>
    </div>
  );
}
