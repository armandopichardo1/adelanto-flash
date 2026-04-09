import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/twilio";

const BodySchema = z.object({
  to: z.string().min(10).max(20),
  event: z.enum(["requested", "approved", "deposited", "deduction"]),
  amount: z.number().positive(),
  date: z.string().optional(),
});

const templates: Record<string, (amount: string, date?: string) => string> = {
  requested: (amount) =>
    `✅ *Adelanto Ya* — Tu solicitud de ${amount} ha sido recibida. Te notificaremos cuando sea aprobada.`,
  approved: (amount) =>
    `🎉 *Adelanto Ya* — ¡Tu adelanto de ${amount} fue aprobado! El depósito se realizará hoy.`,
  deposited: (amount) =>
    `💰 *Adelanto Ya* — Se ha depositado ${amount} en tu cuenta. ¡Disfruta tu dinero!`,
  deduction: (amount, date) =>
    `📋 *Adelanto Ya* — Se descontará ${amount} de tu nómina el ${date || "próximo período"}.`,
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const TWILIO_API_KEY = Deno.env.get("TWILIO_API_KEY");
    if (!TWILIO_API_KEY) {
      console.log("TWILIO_API_KEY not configured — notification skipped");
      return new Response(
        JSON.stringify({ success: false, reason: "Twilio not configured" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const TWILIO_FROM = Deno.env.get("TWILIO_WHATSAPP_FROM") || "whatsapp:+14155238886";

    const parsed = BodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: parsed.error.flatten().fieldErrors }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { to, event, amount, date } = parsed.data;
    const formattedAmount = new Intl.NumberFormat("es-DO", {
      style: "currency",
      currency: "DOP",
      minimumFractionDigits: 0,
    }).format(amount).replace("DOP", "RD$");

    const messageBody = templates[event](formattedAmount, date);

    const response = await fetch(`${GATEWAY_URL}/Messages.json`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": TWILIO_API_KEY,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        To: `whatsapp:${to}`,
        From: TWILIO_FROM,
        Body: messageBody,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(`Twilio API error [${response.status}]: ${JSON.stringify(data)}`);
    }

    return new Response(
      JSON.stringify({ success: true, sid: data.sid }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("WhatsApp notification error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
