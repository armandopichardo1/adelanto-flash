import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Building2, Shield } from "lucide-react";

export function CTA() {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl gradient-hero p-8 md:p-16">
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-1/2 -right-1/4 w-[500px] h-[500px] rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-1/4 -left-1/4 w-[400px] h-[400px] rounded-full bg-white/5 blur-3xl" />
          </div>

          <div className="relative grid md:grid-cols-3 gap-8 items-center">
            {/* Employee CTA */}
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-3">
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
            <div className="text-center md:border-x md:border-white/20 md:px-8">
              <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-3">
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
              <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-3">
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
