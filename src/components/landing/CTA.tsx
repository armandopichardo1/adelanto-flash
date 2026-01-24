import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Building2 } from "lucide-react";

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

          <div className="relative grid md:grid-cols-2 gap-10 items-center">
            {/* Employee CTA */}
            <div className="text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                Empleados
              </h2>
              <p className="text-primary-foreground/90 text-lg mb-6">
                ¿Tu empresa ya está en Dinero Ya? Accede ahora a tu cuenta y solicita tu primer adelanto.
              </p>
              <Button variant="white" size="lg" asChild>
                <Link to="/login">
                  Acceder a mi Cuenta
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>

            {/* Company CTA */}
            <div className="text-center md:text-left md:border-l md:border-white/20 md:pl-10">
              <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                Empresas
              </h2>
              <p className="text-primary-foreground/90 text-lg mb-6">
                Ofrece bienestar financiero a tu equipo. Retención mejorada, cero costo para ti.
              </p>
              <Button variant="white" size="lg" asChild>
                <Link to="/login">
                  <Building2 className="w-5 h-5" />
                  Solicitar Demo
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
