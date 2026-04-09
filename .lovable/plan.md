

# Plan: New Screens + WhatsApp Notifications

## Summary
Add 8 new screens/features from the wireframe (excluding Onboarding Carousel, Standalone Simulator, and OTP Login Flow), add birth date to Profile, and set up WhatsApp notifications via Twilio for automatic status updates.

## Screens to Build

### 1. Splash Screen (`/splash`)
- Logo centered, tagline, "Comenzar" and "Ya tengo cuenta" buttons
- Routes to eligibility check or login

### 2. Company Eligibility Check (`/eligibility`)
- Form: Cédula, Empresa (searchable dropdown), correo/código empleado, fecha de nacimiento
- Success/error states with visual feedback
- Routes to login on success

### 3. Personalized Offer Screen (new step in advance flow)
- Insert between simulator and confirmation in `AdvanceRequestFlow.tsx`
- Shows approved amount, term, cuota, deposit date, frequency, total cost, "sin cargos ocultos"
- "Aceptar oferta" / "Ver detalle completo" buttons

### 4. Request Status Tracker (`/request-status`)
- Visual pipeline: En revisión → Aprobado → Depositado
- Animated step indicator, "Tu dinero será depositado hoy" message

### 5. Active Loan Detail (`/advance/:id`)
- Saldo pendiente card, próxima cuota, fecha
- Payment calendar (list of upcoming deductions)
- "Pagar anticipadamente" and "Ver contrato" buttons

### 6. Full History (`/history`)
- Filterable list of all advances (active, completed) with date, amount, status pill
- Click → detail. Connected from BottomNav "Historial"

### 7. Profile Screen (`/profile`)
- Personal data: nombre, cédula, **fecha de nacimiento**, correo, teléfono
- Company info: empresa, departamento, fecha ingreso
- Bank account: banco, tipo cuenta, número
- Security: PIN/biometría toggles (UI only)
- WhatsApp notification preferences toggle
- Support link, "Cerrar sesión"

### 8. Support / Help Center (`/support`)
- FAQ accordion (existing shadcn Accordion)
- Chat placeholder card, contact info, terms/policies links

## WhatsApp Notifications (Twilio)

### Infrastructure
- Connect Twilio via `standard_connectors--connect`
- Edge function `whatsapp-notify` sends templated WhatsApp messages

### Notification Events
| Event | Message |
|---|---|
| Requested | "Tu solicitud de {amount} ha sido recibida." |
| Approved | "¡Tu adelanto de {amount} fue aprobado!" |
| Deposited | "Se ha depositado {amount} en tu cuenta." |
| Deduction | "Se descontará {amount} de tu nómina el {date}." |

### Database
- New table `notification_preferences`: id, user_id, whatsapp_enabled, phone_number, created_at, updated_at
- RLS: users read/update only their own row

## Files to Create/Edit

| File | Action |
|---|---|
| `src/pages/SplashPage.tsx` | Create |
| `src/pages/EligibilityCheck.tsx` | Create |
| `src/pages/RequestStatus.tsx` | Create |
| `src/pages/ActiveLoanDetail.tsx` | Create |
| `src/pages/HistoryPage.tsx` | Create |
| `src/pages/ProfilePage.tsx` | Create |
| `src/pages/SupportPage.tsx` | Create |
| `src/pages/AdvanceRequestFlow.tsx` | Edit — add offer step |
| `src/components/shared/BottomNav.tsx` | Edit — add working navigation links |
| `src/App.tsx` | Edit — add new routes |
| `src/lib/mock-data.ts` | Edit — add birthDate, phone fields |
| `supabase/functions/whatsapp-notify/index.ts` | Create |
| DB migration | Create `notification_preferences` table |

## Implementation Order
1. Mock data updates (birthDate, phone)
2. New page components (Splash → Eligibility → Profile → History → Support → Status → Active Loan)
3. Update AdvanceRequestFlow with offer step
4. Update BottomNav with real navigation
5. Update App.tsx routes
6. Connect Twilio + create WhatsApp edge function
7. Create notification_preferences table + RLS

