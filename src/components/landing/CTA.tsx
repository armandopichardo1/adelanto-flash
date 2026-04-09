import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Building2, Shield } from "lucide-react";

export function CTA() {
  return (
    <section className="py-20 md:py-28 bg-surface">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary-container p-8 md:p-16 shadow-[0_20px_40px_rgba(0,110,42,0.1)]">
          {/* Background decoration */}
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-primary-foreground/10 rounded-full blur-3xl" />
          <div className="absolute -top-1/2 -left-1/4 w-[400px] h-[400px] rounded-full bg-primary-foreground/5 blur-3xl" />

          <div className="relative grid md:grid-cols-3 gap-10 items-center">
            {/* Employee CTA */}
            <div className="text-center">
              <h2 className="font-headline text-2xl md:text-3xl font-bold text-primary-foreground mb-3">
                Empleados
              </h2>
              <p className="text-primary-foreground/90 text-base mb-5">
                Accede a tu cuenta y solicita tu primer adelanto.
              </p>
              <Button variant="white" size="lg" asChild>
                <Link to="/login?type=employee">
                  Acceder como Empleado
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>

            {/* HR CTA */}
            <div className="text-center md:px-8">
              <h2 className="font-headline text-2xl md:text-3xl font-bold text-primary-foreground mb-3">
                RRHH
              </h2>
              <p className="text-primary-foreground/90 text-base mb-5">
                Gestiona adelantos y visualiza el riesgo de tu equipo.
              </p>
              <Button variant="white" size="lg" asChild>
                <Link to="/login?type=hr">
                  <Building2 className="w-5 h-5" />
                  Acceder como RRHH
                </Link>
              </Button>
            </div>

            {/* Admin CTA */}
            <div className="text-center">
              <h2 className="font-headline text-2xl md:text-3xl font-bold text-primary-foreground mb-3">
                Admin
              </h2>
              <p className="text-primary-foreground/90 text-base mb-5">
                Panel de administración y métricas del sistema.
              </p>
              <Button variant="white" size="lg" asChild>
                <Link to="/login?type=admin">
                  <Shield className="w-5 h-5" />
                  Acceder como Admin
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
