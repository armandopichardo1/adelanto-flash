import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="py-20 md:py-28 bg-surface">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary-container p-8 md:p-16 shadow-[0_20px_40px_rgba(0,110,42,0.1)]">
          {/* Background decoration */}
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-primary-foreground/10 rounded-full blur-3xl" />
          <div className="absolute -top-1/2 -left-1/4 w-[400px] h-[400px] rounded-full bg-primary-foreground/5 blur-3xl" />

          <div className="relative text-center max-w-2xl mx-auto">
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              ¿Listo para acceder a tu salario?
            </h2>
            <p className="text-primary-foreground/90 text-lg mb-8">
              Únete a miles de trabajadores dominicanos que ya disfrutan de libertad financiera. Tu dinero ganado, cuando lo necesites.
            </p>
            <Button variant="white" size="xl" asChild>
              <Link to="/login">
                Iniciar Sesión
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
