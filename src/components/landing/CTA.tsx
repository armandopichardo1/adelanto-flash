import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Building2, Users, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const benefits = [
  { icon: Users, text: "Reduce rotación hasta un 32%" },
  { icon: ShieldCheck, text: "Cero riesgo para tu empresa" },
  { icon: Building2, text: "Integración simple con nómina" },
];

export function CTA() {
  return (
    <section className="py-16 md:py-32 bg-surface-container-low">
      <div className="container mx-auto px-4">
        <motion.div
          className="relative rounded-3xl overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          {/* Background */}
          <div className="absolute inset-0 bg-foreground" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
          <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 rounded-bl-[200px]" />

          <div className="relative px-8 py-16 md:px-16 md:py-20">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <p className="text-primary font-semibold text-sm tracking-wide uppercase mb-3">Para empresas</p>
                <h2 className="font-headline text-3xl md:text-4xl font-bold text-background mb-4">
                  Ofrece bienestar financiero real a tu equipo
                </h2>
                <p className="text-background/70 text-lg mb-8 leading-relaxed">
                  Más que un beneficio laboral — una herramienta que reduce estrés financiero, mejora productividad y posiciona a tu empresa como empleador de preferencia.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="hero" size="xl" className="rounded-2xl bg-primary text-primary-foreground" asChild>
                    <Link to="/login?type=hr">
                      Registra tu Empresa
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </Button>
                  <Button variant="white" size="lg" className="rounded-2xl" asChild>
                    <Link to="/login">Solicitar Demo</Link>
                  </Button>
                </div>
              </motion.div>

              {/* Right — Benefits */}
              <div className="space-y-5">
                {benefits.map((b, i) => (
                  <motion.div
                    key={b.text}
                    className="flex items-center gap-4 p-5 rounded-2xl bg-background/5 backdrop-blur-sm"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.45, ease: "easeOut" }}
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <b.icon className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-background font-medium text-lg">{b.text}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
