import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import heroImage from "@/assets/hero-worker.jpg";

const trustPoints = [
  "Aprobación en minutos",
  "Sin cargos ocultos",
  "Regulado y transparente",
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-surface min-h-[50vh] lg:min-h-[70vh] flex items-center">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[60%] h-full bg-accent/30 rounded-bl-[120px]" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-secondary-container/10 blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 py-8 md:py-0">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-center">
          {/* Left — Copy */}
          <motion.div
            className="max-w-xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <motion.p
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-xs font-semibold tracking-wide uppercase mb-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              Bienestar financiero para tu equipo
            </motion.p>

            <h1 className="font-headline text-3xl md:text-4xl lg:text-5xl font-extrabold leading-[1.1] text-foreground mb-3">
              Accede a tu salario{" "}
              <span className="relative">
                <span className="text-primary">cuando lo necesites</span>
                <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 300 12" fill="none">
                  <motion.path
                    d="M2 8C50 3 150 2 298 8"
                    stroke="hsl(145 100% 22%)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    opacity="0.3"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
                  />
                </svg>
              </span>
            </h1>

            <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-4">
              Adelanto Ya permite a los trabajadores dominicanos acceder a su dinero ganado antes del día de pago. Sin trámites, sin esperas — solo tu esfuerzo convertido en liquidez inmediata.
            </p>

            <ul className="space-y-1.5 mb-6">
              {trustPoints.map((point, i) => (
                <motion.li
                  key={point}
                  className="flex items-center gap-3 text-foreground"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1, duration: 0.4 }}
                >
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="font-medium">{point}</span>
                </motion.li>
              ))}
            </ul>

            <motion.div
              className="flex flex-col sm:flex-row gap-3"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <Button variant="hero" size="xl" className="rounded-2xl" asChild>
                <Link to="/login">
                  Solicitar Adelanto
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button variant="white" size="lg" className="rounded-2xl" asChild>
                <a href="#como-funciona">¿Cómo funciona?</a>
              </Button>
            </motion.div>
          </motion.div>

          {/* Right — Photo */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
          >
            <div className="relative rounded-3xl overflow-hidden shadow-elevated">
              <img
                src={heroImage}
                alt="Trabajadora dominicana accediendo a su adelanto de salario desde su celular"
                width={1280}
                height={960}
                className="w-full h-[240px] md:h-[320px] lg:h-[420px] object-cover object-top"
              />
              <motion.div
                className="absolute bottom-6 left-6 bg-surface-container-lowest/90 backdrop-blur-xl rounded-2xl p-4 shadow-elevated"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                <p className="text-xs text-muted-foreground mb-0.5">Adelanto aprobado</p>
                <p className="font-headline text-2xl font-bold text-primary">RD$12,500</p>
                <p className="text-xs text-muted-foreground mt-1">En tu cuenta en 3 minutos →</p>
              </motion.div>
            </div>

            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-2xl bg-accent/60 -z-10" />
            <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-secondary-container/30 -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
