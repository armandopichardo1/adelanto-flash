import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Stats } from "@/components/landing/Stats";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";
import { LoanCalculator } from "@/components/landing/LoanCalculator";

const Index = () => {
  return (
    <div className="min-h-screen bg-surface">
      <Header />
      <main className="pt-16 md:pt-20">
        <Hero />
        <section id="como-funciona">
          <HowItWorks />
        </section>
        <Features />
        <section id="calculadora">
          <LoanCalculator />
        </section>
        <Stats />
        <section id="empresas">
          <CTA />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
