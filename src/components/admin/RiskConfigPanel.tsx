import { useState, useMemo, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Settings,
  Save,
  Info,
  TrendingUp,
  AlertTriangle,
  Shield,
  Building2,
  Calculator,
  RotateCcw,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { formatDOP } from "@/lib/advance-calculator";
import { mockEmployers } from "@/lib/mock-data";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// ─── Risk Category Definitions & Recommendations ────────────
interface RiskCategoryInfo {
  id: string;
  label: string;
  description: string;
  recommendation: string;
  warningThreshold: { min: number; max: number };
  dangerThreshold: { below?: number; above?: number };
  icon: React.ReactNode;
}

const RISK_CATEGORIES: Record<string, RiskCategoryInfo> = {
  safetyCap: {
    id: "safetyCap",
    label: "Safety Cap",
    description:
      "Porcentaje máximo del salario que un empleado puede adelantar. Actúa como límite absoluto independiente de la antigüedad o el respaldo acumulado.",
    recommendation:
      "Recomendamos 40–60% para balancear acceso y riesgo. Por debajo de 30% limita demasiado a empleados con buen historial. Por encima de 70% aumenta exposición.",
    warningThreshold: { min: 30, max: 70 },
    dangerThreshold: { below: 20, above: 80 },
    icon: <Shield className="w-5 h-5" />,
  },
  tenureUnder1: {
    id: "tenureUnder1",
    label: "Antigüedad < 1 año",
    description:
      "Cap de riesgo para empleados nuevos (menos de 12 meses). Estos empleados tienen menor respaldo laboral acumulado y menor historial de pago.",
    recommendation:
      "Recomendamos 15–25%. Empleados nuevos representan mayor riesgo por menor respaldo y menor vínculo con la empresa. Mantener conservador.",
    warningThreshold: { min: 15, max: 30 },
    dangerThreshold: { below: 10, above: 40 },
    icon: <AlertTriangle className="w-5 h-5" />,
  },
  tenure1to3: {
    id: "tenure1to3",
    label: "Antigüedad 1–3 años",
    description:
      "Cap de riesgo para empleados con antigüedad media. Ya tienen historial y respaldo laboral significativo acumulado.",
    recommendation:
      "Recomendamos 40–60%. Estos empleados ya demostraron estabilidad. Pueden acceder a montos mayores con riesgo moderado.",
    warningThreshold: { min: 35, max: 65 },
    dangerThreshold: { below: 25, above: 75 },
    icon: <TrendingUp className="w-5 h-5" />,
  },
  tenureOver3: {
    id: "tenureOver3",
    label: "Antigüedad > 3 años",
    description:
      "Cap de riesgo para empleados veteranos. Tienen el mayor respaldo laboral y el historial más largo. El riesgo de salida es bajo.",
    recommendation:
      "Recomendamos 70–90%. Empleados veteranos son los más seguros. Cap alto maximiza su acceso sin comprometer la cartera.",
    warningThreshold: { min: 60, max: 95 },
    dangerThreshold: { below: 50, above: 100 },
    icon: <Shield className="w-5 h-5" />,
  },
  maxConcentration: {
    id: "maxConcentration",
    label: "Concentración por Empresa",
    description:
      "Porcentaje máximo del capital total que puede estar expuesto a una sola empresa. Controla el riesgo de concentración si una empresa entra en dificultades.",
    recommendation:
      "Recomendamos 10–20%. Si una empresa representa más del 25% del portafolio, un evento adverso podría impactar significativamente la cartera.",
    warningThreshold: { min: 8, max: 22 },
    dangerThreshold: { below: 5, above: 30 },
    icon: <Building2 className="w-5 h-5" />,
  },
};

// ─── Impact Calculator ──────────────────────────────────────
interface ImpactResult {
  sampleEmployee: string;
  salary: number;
  tenure: string;
  currentMax: number;
  newMax: number;
  delta: number;
  deltaPercent: number;
}

function calculateImpact(
  safetyCap: number,
  tenureUnder1: number,
  tenure1to3: number,
  tenureOver3: number
): ImpactResult[] {
  const samples = [
    { name: "Emp. nuevo (6 meses)", salary: 22000, tenureYears: 0.5, tenure: "< 1 año", capKey: "under1" as const },
    { name: "Emp. medio (2 años)", salary: 28500, tenureYears: 2.0, tenure: "1–3 años", capKey: "1to3" as const },
    { name: "Emp. veterano (5 años)", salary: 38000, tenureYears: 5.0, tenure: "> 3 años", capKey: "over3" as const },
  ];

  const defaults = { under1: 20, "1to3": 50, over3: 80, safetyCap: 50 };
  const newValues = { under1: tenureUnder1, "1to3": tenure1to3, over3: tenureOver3, safetyCap };

  return samples.map((s) => {
    const dailySalary = s.salary / 23.83;
    const collateral = dailySalary * 21 * s.tenureYears;

    const defaultTenureCap = collateral * (defaults[s.capKey] / 100);
    const defaultSalaryCap = s.salary * (defaults.safetyCap / 100);
    const defaultMax = Math.floor(Math.min(defaultTenureCap, defaultSalaryCap, s.salary * 0.30));

    const newTenureCap = collateral * (newValues[s.capKey] / 100);
    const newSalaryCap = s.salary * (newValues.safetyCap / 100);
    const newMax = Math.floor(Math.min(newTenureCap, newSalaryCap, s.salary * 0.30));

    const delta = newMax - defaultMax;
    const deltaPercent = defaultMax > 0 ? (delta / defaultMax) * 100 : 0;

    return {
      sampleEmployee: s.name,
      salary: s.salary,
      tenure: s.tenure,
      currentMax: defaultMax,
      newMax,
      delta,
      deltaPercent,
    };
  });
}

// ─── Component ──────────────────────────────────────────────
export function RiskConfigPanel() {
  const queryClient = useQueryClient();
  const [selectedCompany, setSelectedCompany] = useState<string>("global");
  const [safetyCap, setSafetyCap] = useState(50);
  const [tenureUnder1, setTenureUnder1] = useState(20);
  const [tenure1to3, setTenure1to3] = useState(50);
  const [tenureOver3, setTenureOver3] = useState(80);
  const [maxConcentration, setMaxConcentration] = useState(15);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [showCalculator, setShowCalculator] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dbDefaults, setDbDefaults] = useState({ safetyCap: 50, tenureUnder1: 20, tenure1to3: 50, tenureOver3: 80, maxConcentration: 15 });

  const loadConfig = useCallback(async (companyId: string) => {
    setLoading(true);
    const query = companyId === "global"
      ? supabase.from("risk_config").select("*").is("company_id", null).single()
      : supabase.from("risk_config").select("*").eq("company_id", companyId).maybeSingle();
    
    const { data } = await query;
    
    if (data) {
      const vals = {
        safetyCap: Math.round(Number(data.safety_cap) * 100),
        tenureUnder1: Math.round(Number(data.tenure_under_1yr) * 100),
        tenure1to3: Math.round(Number(data.tenure_1_to_3yr) * 100),
        tenureOver3: Math.round(Number(data.tenure_over_3yr) * 100),
        maxConcentration: Math.round(Number(data.max_advance_per_employer) * 100),
      };
      setSafetyCap(vals.safetyCap);
      setTenureUnder1(vals.tenureUnder1);
      setTenure1to3(vals.tenure1to3);
      setTenureOver3(vals.tenureOver3);
      setMaxConcentration(vals.maxConcentration);
      setDbDefaults(vals);
    } else if (companyId !== "global") {
      // No company override exists — load global as baseline
      const { data: globalData } = await supabase.from("risk_config").select("*").is("company_id", null).single();
      if (globalData) {
        const vals = {
          safetyCap: Math.round(Number(globalData.safety_cap) * 100),
          tenureUnder1: Math.round(Number(globalData.tenure_under_1yr) * 100),
          tenure1to3: Math.round(Number(globalData.tenure_1_to_3yr) * 100),
          tenureOver3: Math.round(Number(globalData.tenure_over_3yr) * 100),
          maxConcentration: Math.round(Number(globalData.max_advance_per_employer) * 100),
        };
        setSafetyCap(vals.safetyCap);
        setTenureUnder1(vals.tenureUnder1);
        setTenure1to3(vals.tenure1to3);
        setTenureOver3(vals.tenureOver3);
        setMaxConcentration(vals.maxConcentration);
        setDbDefaults(vals);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => { loadConfig(selectedCompany); }, [selectedCompany, loadConfig]);

  const hasChanges = useMemo(() => {
    return safetyCap !== dbDefaults.safetyCap || tenureUnder1 !== dbDefaults.tenureUnder1 || tenure1to3 !== dbDefaults.tenure1to3 || tenureOver3 !== dbDefaults.tenureOver3 || maxConcentration !== dbDefaults.maxConcentration;
  }, [safetyCap, tenureUnder1, tenure1to3, tenureOver3, maxConcentration, dbDefaults]);

  const handleReset = () => {
    setSafetyCap(dbDefaults.safetyCap);
    setTenureUnder1(dbDefaults.tenureUnder1);
    setTenure1to3(dbDefaults.tenure1to3);
    setTenureOver3(dbDefaults.tenureOver3);
    setMaxConcentration(dbDefaults.maxConcentration);
    toast.info("Valores restaurados");
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      safety_cap: safetyCap / 100,
      max_salary_deduction_rate: 0.30, // Art. 201 fixed
      tenure_under_1yr: tenureUnder1 / 100,
      tenure_1_to_3yr: tenure1to3 / 100,
      tenure_over_3yr: tenureOver3 / 100,
      max_advance_per_employer: maxConcentration / 100,
    };
    const companyId = selectedCompany === "global" ? null : selectedCompany;

    // Upsert: update if exists, insert if not
    const { data: existing } = companyId
      ? await supabase.from("risk_config").select("id").eq("company_id", companyId).maybeSingle()
      : await supabase.from("risk_config").select("id").is("company_id", null).single();

    let error;
    if (existing) {
      ({ error } = await supabase.from("risk_config").update(payload).eq("id", existing.id));
    } else {
      ({ error } = await supabase.from("risk_config").insert({ ...payload, company_id: companyId }));
    }

    if (error) {
      console.error("Error saving risk config:", error);
      toast.error("Error guardando configuración de riesgo");
    } else {
      const scope = selectedCompany === "global" ? "genérica" : mockEmployers.find((e) => e.id === selectedCompany)?.name;
      toast.success(`Configuración de riesgo ${scope} guardada`);
      setDbDefaults({ safetyCap, tenureUnder1, tenure1to3, tenureOver3, maxConcentration });
      // Invalidate all risk-config queries so employee dashboards pick up changes
      queryClient.invalidateQueries({ queryKey: ["risk-config"] });
    }
    setSaving(false);
  };

  const handleCompanyChange = (value: string) => {
    setSelectedCompany(value);
  };

  function getHealthColor(categoryId: string, value: number): string {
    const cat = RISK_CATEGORIES[categoryId];
    if (!cat) return "text-foreground";
    if (cat.dangerThreshold.below !== undefined && value < cat.dangerThreshold.below) return "text-destructive";
    if (cat.dangerThreshold.above !== undefined && value > cat.dangerThreshold.above) return "text-destructive";
    if (value < cat.warningThreshold.min || value > cat.warningThreshold.max) return "text-warning";
    return "text-primary";
  }

  function getHealthBadge(categoryId: string, value: number): { label: string; className: string } {
    const cat = RISK_CATEGORIES[categoryId];
    if (!cat) return { label: "—", className: "" };
    if (cat.dangerThreshold.below !== undefined && value < cat.dangerThreshold.below)
      return { label: "⚠ Muy bajo", className: "bg-destructive/10 text-destructive" };
    if (cat.dangerThreshold.above !== undefined && value > cat.dangerThreshold.above)
      return { label: "⚠ Muy alto", className: "bg-destructive/10 text-destructive" };
    if (value < cat.warningThreshold.min)
      return { label: "Bajo", className: "bg-warning/10 text-warning" };
    if (value > cat.warningThreshold.max)
      return { label: "Alto", className: "bg-warning/10 text-warning" };
    return { label: "✓ Óptimo", className: "bg-accent text-accent-foreground" };
  }

  return (
    <section className="bg-surface-container-lowest rounded-2xl shadow-card overflow-hidden">
      {/* Header */}
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            <h2 className="font-headline text-xl font-bold text-foreground">Configuración de Riesgo</h2>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <Select value={selectedCompany} onValueChange={handleCompanyChange}>
              <SelectTrigger className="w-[220px]">
                <Building2 className="w-4 h-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Alcance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="global">🌐 Configuración Global</SelectItem>
                {mockEmployers.map((emp) => (
                  <SelectItem key={emp.id} value={emp.id}>
                    {emp.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {hasChanges && (
              <Button variant="outline" size="sm" onClick={handleReset}>
                <RotateCcw className="w-4 h-4" /> Restaurar
              </Button>
            )}
            <Button onClick={handleSave} size="sm">
              <Save className="w-4 h-4" /> Guardar
            </Button>
          </div>
        </div>
        <p className="text-muted-foreground mt-1">
          {selectedCompany === "global"
            ? "Configura los límites de riesgo que aplican a todas las empresas por defecto."
            : `Configuración específica para ${mockEmployers.find((e) => e.id === selectedCompany)?.name}. Sobreescribe la configuración global.`}
        </p>
        {selectedCompany !== "global" && (
          <Badge variant="outline" className="mt-2 text-secondary border-secondary">
            Override activo — esta empresa usa valores personalizados
          </Badge>
        )}
      </div>

      {/* Risk Sliders with Definitions */}
      <div className="px-6 pb-6 space-y-4">
        {/* Safety Cap & Art. 201 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RiskSliderCard
            categoryId="safetyCap"
            value={safetyCap}
            onChange={setSafetyCap}
            min={10}
            max={100}
            step={5}
            suffix="%"
            expanded={expandedCategory === "safetyCap"}
            onToggle={() => setExpandedCategory(expandedCategory === "safetyCap" ? null : "safetyCap")}
            healthColor={getHealthColor("safetyCap", safetyCap)}
            healthBadge={getHealthBadge("safetyCap", safetyCap)}
          />
          <div className="bg-surface-container-low rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-5 h-5 text-muted-foreground" />
              <Label className="text-sm font-semibold">Art. 201 Cap (fijo)</Label>
              <span className="text-sm font-bold text-muted-foreground ml-auto">30%</span>
            </div>
            <div className="h-2 rounded-full bg-surface-container-high">
              <div className="h-full w-[30%] rounded-full bg-muted-foreground/50" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              No modificable — Código Laboral Art. 201. El descuento máximo por nómina es siempre 30% del salario mensual.
            </p>
            <div className="mt-3 p-3 bg-surface-container rounded-xl">
              <p className="text-xs text-muted-foreground">
                <Info className="w-3 h-3 inline mr-1" />
                Este es un límite legal que aplica siempre, independientemente de la configuración de riesgo. Protege al empleado de sobreendeudamiento.
              </p>
            </div>
          </div>
        </div>

        {/* Tenure Caps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <RiskSliderCard
            categoryId="tenureUnder1"
            value={tenureUnder1}
            onChange={setTenureUnder1}
            min={5}
            max={50}
            step={5}
            suffix="%"
            expanded={expandedCategory === "tenureUnder1"}
            onToggle={() => setExpandedCategory(expandedCategory === "tenureUnder1" ? null : "tenureUnder1")}
            healthColor={getHealthColor("tenureUnder1", tenureUnder1)}
            healthBadge={getHealthBadge("tenureUnder1", tenureUnder1)}
          />
          <RiskSliderCard
            categoryId="tenure1to3"
            value={tenure1to3}
            onChange={setTenure1to3}
            min={10}
            max={80}
            step={5}
            suffix="%"
            expanded={expandedCategory === "tenure1to3"}
            onToggle={() => setExpandedCategory(expandedCategory === "tenure1to3" ? null : "tenure1to3")}
            healthColor={getHealthColor("tenure1to3", tenure1to3)}
            healthBadge={getHealthBadge("tenure1to3", tenure1to3)}
          />
          <RiskSliderCard
            categoryId="tenureOver3"
            value={tenureOver3}
            onChange={setTenureOver3}
            min={20}
            max={100}
            step={5}
            suffix="%"
            expanded={expandedCategory === "tenureOver3"}
            onToggle={() => setExpandedCategory(expandedCategory === "tenureOver3" ? null : "tenureOver3")}
            healthColor={getHealthColor("tenureOver3", tenureOver3)}
            healthBadge={getHealthBadge("tenureOver3", tenureOver3)}
          />
        </div>

        {/* Max Concentration */}
        <RiskSliderCard
          categoryId="maxConcentration"
          value={maxConcentration}
          onChange={setMaxConcentration}
          min={5}
          max={30}
          step={1}
          suffix="%"
          expanded={expandedCategory === "maxConcentration"}
          onToggle={() => setExpandedCategory(expandedCategory === "maxConcentration" ? null : "maxConcentration")}
          healthColor={getHealthColor("maxConcentration", maxConcentration)}
          healthBadge={getHealthBadge("maxConcentration", maxConcentration)}
        />

        {/* Impact Calculator Toggle */}
        <button
          onClick={() => setShowCalculator(!showCalculator)}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-surface-container-low hover:bg-surface-container transition-colors text-sm font-medium text-primary"
        >
          <Calculator className="w-4 h-4" />
          Calculadora de Impacto
          {showCalculator ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {/* Impact Calculator */}
        {showCalculator && (
          <div className="bg-surface-container-low rounded-2xl p-5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-2 mb-2">
              <Calculator className="w-5 h-5 text-primary" />
              <h3 className="font-headline font-bold text-foreground">¿Qué significan estos cambios?</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Simulación del impacto en el cupo máximo para 3 perfiles de empleado típicos de Zona Franca:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {impacts.map((impact) => (
                <div
                  key={impact.sampleEmployee}
                  className="bg-surface-container-lowest rounded-xl p-4 space-y-3"
                >
                  <div>
                    <p className="font-semibold text-sm text-foreground">{impact.sampleEmployee}</p>
                    <p className="text-xs text-muted-foreground">
                      Salario: {formatDOP(impact.salary)} · {impact.tenure}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Cupo actual</span>
                      <span className="font-medium text-foreground">{formatDOP(impact.currentMax)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Cupo nuevo</span>
                      <span className="font-bold text-foreground">{formatDOP(impact.newMax)}</span>
                    </div>
                  </div>
                  <div
                    className={`flex items-center justify-between p-2 rounded-lg ${
                      impact.delta > 0
                        ? "bg-accent text-primary"
                        : impact.delta < 0
                        ? "bg-destructive/10 text-destructive"
                        : "bg-surface-container text-muted-foreground"
                    }`}
                  >
                    <span className="text-xs font-medium">Cambio</span>
                    <span className="text-sm font-bold">
                      {impact.delta > 0 ? "+" : ""}
                      {formatDOP(impact.delta)}{" "}
                      <span className="text-xs font-normal">
                        ({impact.deltaPercent > 0 ? "+" : ""}
                        {impact.deltaPercent.toFixed(1)}%)
                      </span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
            {hasChanges && (
              <div className="p-3 bg-warning/10 rounded-xl flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-warning mt-0.5 shrink-0" />
                <p className="text-xs text-warning">
                  Los cambios afectarán los cupos de todos los empleados{" "}
                  {selectedCompany === "global"
                    ? "en todas las empresas"
                    : `de ${mockEmployers.find((e) => e.id === selectedCompany)?.name}`}
                  . Revisa el impacto antes de guardar.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Risk Slider Card Sub-Component ─────────────────────────
function RiskSliderCard({
  categoryId,
  value,
  onChange,
  min,
  max,
  step,
  suffix,
  expanded,
  onToggle,
  healthColor,
  healthBadge,
}: {
  categoryId: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  suffix: string;
  expanded: boolean;
  onToggle: () => void;
  healthColor: string;
  healthBadge: { label: string; className: string };
}) {
  const cat = RISK_CATEGORIES[categoryId];
  if (!cat) return null;

  return (
    <div className="bg-surface-container-low rounded-2xl p-5 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={healthColor}>{cat.icon}</span>
          <Label className="text-sm font-semibold">{cat.label}</Label>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={`text-xs ${healthBadge.className}`}>
            {healthBadge.label}
          </Badge>
          <span className={`text-sm font-bold ${healthColor}`}>
            {value}{suffix}
          </span>
        </div>
      </div>

      {/* Slider */}
      <Slider
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        min={min}
        max={max}
        step={step}
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{min}{suffix}</span>
        <span>{max}{suffix}</span>
      </div>

      {/* Expand/Collapse Info */}
      <button
        onClick={onToggle}
        className="flex items-center gap-1 text-xs text-primary font-medium hover:text-primary/80 transition-colors"
      >
        <Info className="w-3 h-3" />
        {expanded ? "Ocultar definición" : "Ver definición y recomendación"}
        {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>

      {expanded && (
        <div className="space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="p-3 bg-surface-container rounded-xl">
            <p className="text-xs text-foreground font-medium mb-1">📖 Definición</p>
            <p className="text-xs text-muted-foreground">{cat.description}</p>
          </div>
          <div className="p-3 bg-accent/50 rounded-xl">
            <p className="text-xs text-primary font-medium mb-1">💡 Recomendación</p>
            <p className="text-xs text-muted-foreground">{cat.recommendation}</p>
          </div>
          <div className="flex gap-2 text-xs">
            <span className="px-2 py-0.5 rounded-full bg-accent text-accent-foreground">
              Óptimo: {cat.warningThreshold.min}–{cat.warningThreshold.max}{suffix}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
