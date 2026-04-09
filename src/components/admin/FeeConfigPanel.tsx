import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, DollarSign, Percent, Layers, Save, Loader2, Trash2, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type FeeMode = "flat" | "percentage" | "tiered";

interface TierRow {
  maxSalary: number;
  fee: number;
}

const FEE_CONFIG_ID = "00000000-0000-0000-0000-000000000001";

export function FeeConfigPanel() {
  const queryClient = useQueryClient();
  const [mode, setMode] = useState<FeeMode>("flat");
  const [flatAmount, setFlatAmount] = useState(200);
  const [percentageRate, setPercentageRate] = useState(3); // displayed as %, stored as decimal
  const [tiers, setTiers] = useState<TierRow[]>([
    { maxSalary: 25000, fee: 150 },
    { maxSalary: 50000, fee: 200 },
    { maxSalary: 100000, fee: 300 },
    { maxSalary: 999999999, fee: 400 },
  ]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  async function fetchConfig() {
    setLoading(true);
    const { data, error } = await supabase
      .from("fee_config")
      .select("*")
      .eq("id", FEE_CONFIG_ID)
      .single();

    if (error) {
      console.error("Error fetching fee config:", error);
      toast.error("Error cargando configuración de comisiones");
    } else if (data) {
      setMode(data.mode as FeeMode);
      setFlatAmount(Number(data.flat_amount));
      setPercentageRate(Number(data.percentage_rate) * 100);
      setTiers(data.tiers as unknown as TierRow[]);
    }
    setLoading(false);
  }

  async function handleSave() {
    setSaving(true);
    const { error } = await supabase
      .from("fee_config")
      .update({
        mode,
        flat_amount: flatAmount,
        percentage_rate: percentageRate / 100,
        tiers: JSON.parse(JSON.stringify(tiers)),
      })
      .eq("id", FEE_CONFIG_ID);

    if (error) {
      console.error("Error saving fee config:", error);
      toast.error("Error guardando configuración");
    } else {
      toast.success("Configuración de comisiones actualizada");
      queryClient.invalidateQueries({ queryKey: ["fee-config"] });
    }
    setSaving(false);
  }

  function addTier() {
    const lastTier = tiers[tiers.length - 1];
    const newMaxSalary = lastTier ? lastTier.maxSalary + 25000 : 25000;
    setTiers([...tiers, { maxSalary: newMaxSalary, fee: 200 }]);
  }

  function removeTier(index: number) {
    if (tiers.length <= 1) return;
    setTiers(tiers.filter((_, i) => i !== index));
  }

  function updateTier(index: number, field: keyof TierRow, value: number) {
    const updated = [...tiers];
    updated[index] = { ...updated[index], [field]: value };
    setTiers(updated);
  }

  if (loading) {
    return (
      <div className="bg-surface-container-lowest rounded-2xl shadow-card p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Cargando configuración...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest rounded-2xl shadow-card overflow-hidden">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            <h2 className="font-headline text-xl font-bold text-foreground">Configuración de Comisiones</h2>
          </div>
          <Button onClick={handleSave} disabled={saving} size="sm">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </div>
        <p className="text-muted-foreground mt-1">Define cómo se calcula la comisión de servicio para cada adelanto.</p>
      </div>

      {/* Mode Selector */}
      <div className="px-6 pb-6">
        <Label className="text-sm font-medium text-foreground mb-3 block">Modo de Comisión</Label>
        <div className="grid grid-cols-3 gap-3">
          <ModeCard
            icon={<DollarSign className="w-5 h-5" />}
            label="Monto Fijo"
            description="Mismo monto por cada adelanto"
            active={mode === "flat"}
            onClick={() => setMode("flat")}
          />
          <ModeCard
            icon={<Percent className="w-5 h-5" />}
            label="Porcentaje"
            description="% del monto solicitado"
            active={mode === "percentage"}
            onClick={() => setMode("percentage")}
          />
          <ModeCard
            icon={<Layers className="w-5 h-5" />}
            label="Escalonado"
            description="Varía según rango salarial"
            active={mode === "tiered"}
            onClick={() => setMode("tiered")}
          />
        </div>
      </div>

      {/* Mode-specific settings */}
      <div className="px-6 pb-6">
        {mode === "flat" && (
          <div className="bg-surface-container-low rounded-2xl p-5">
            <Label htmlFor="flatAmount" className="text-sm font-medium text-foreground mb-2 block">
              Monto Fijo por Adelanto (RD$)
            </Label>
            <Input
              id="flatAmount"
              type="number"
              value={flatAmount}
              onChange={(e) => setFlatAmount(Number(e.target.value))}
              min={0}
              step={50}
              className="max-w-xs"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Cada adelanto tendrá una comisión fija de <strong className="text-foreground">RD${flatAmount.toLocaleString()}</strong>, sin importar el monto.
            </p>
          </div>
        )}

        {mode === "percentage" && (
          <div className="bg-surface-container-low rounded-2xl p-5">
            <Label htmlFor="percentageRate" className="text-sm font-medium text-foreground mb-2 block">
              Tasa de Comisión (%)
            </Label>
            <div className="flex items-center gap-2 max-w-xs">
              <Input
                id="percentageRate"
                type="number"
                value={percentageRate}
                onChange={(e) => setPercentageRate(Number(e.target.value))}
                min={0}
                max={20}
                step={0.5}
              />
              <span className="text-muted-foreground font-medium">%</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Ejemplo: Un adelanto de RD$10,000 tendrá una comisión de{" "}
              <strong className="text-foreground">RD${((10000 * percentageRate) / 100).toLocaleString()}</strong>
            </p>
          </div>
        )}

        {mode === "tiered" && (
          <div className="bg-surface-container-low rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <Label className="text-sm font-medium text-foreground">Tabla de Comisiones por Rango Salarial</Label>
              <Button variant="soft" size="sm" onClick={addTier}>
                <Plus className="w-4 h-4" />
                Agregar Rango
              </Button>
            </div>
            <div className="space-y-3">
              {tiers.map((tier, index) => (
                <div key={index} className="flex items-center gap-3 bg-surface-container-lowest rounded-xl p-3">
                  <div className="flex-1">
                    <Label className="text-xs text-muted-foreground">Salario hasta (RD$)</Label>
                    <Input
                      type="number"
                      value={tier.maxSalary >= 999999999 ? "" : tier.maxSalary}
                      placeholder={tier.maxSalary >= 999999999 ? "Sin límite" : ""}
                      onChange={(e) => updateTier(index, "maxSalary", Number(e.target.value) || 999999999)}
                      min={0}
                      step={5000}
                    />
                  </div>
                  <div className="flex-1">
                    <Label className="text-xs text-muted-foreground">Comisión (RD$)</Label>
                    <Input
                      type="number"
                      value={tier.fee}
                      onChange={(e) => updateTier(index, "fee", Number(e.target.value))}
                      min={0}
                      step={50}
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="mt-4 text-destructive hover:text-destructive"
                    onClick={() => removeTier(index)}
                    disabled={tiers.length <= 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              La comisión se aplica según el rango salarial del empleado. El último rango cubre salarios sin límite.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function ModeCard({
  icon,
  label,
  description,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-2xl text-left transition-all ${
        active
          ? "bg-accent ring-2 ring-primary shadow-card"
          : "bg-surface-container-low hover:bg-surface-container"
      }`}
    >
      <div className={`mb-2 ${active ? "text-primary" : "text-muted-foreground"}`}>{icon}</div>
      <p className={`font-semibold text-sm ${active ? "text-foreground" : "text-foreground"}`}>{label}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
    </button>
  );
}
