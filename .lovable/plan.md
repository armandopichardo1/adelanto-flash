

## Plan: Mejorar Hero y Calculadora

### Problemas detectados
1. **Hero**: La imagen del lado derecho tiene `hidden lg:block`, así que en pantallas menores a `lg` solo se ve texto — se siente vacío. Además, la imagen solo aparece en desktop grande.
2. **Calculadora**: El panel de resultados usa `bg-foreground` (casi negro) con texto `text-background/50` — dificulta la lectura.

### Cambios

**1. Hero — Hacer la imagen visible en todas las pantallas**
- Cambiar `hidden lg:block` a siempre visible
- En mobile/tablet: mostrar la imagen sobre o debajo del texto con altura reducida (~280px)
- Mantener la tarjeta flotante de "Adelanto aprobado"
- Ajustar el grid: en mobile stack vertical, en lg lado a lado

**2. Calculadora — Cambiar fondo del panel de resultados**
- Reemplazar `bg-foreground` (negro) por `gradient-hero` (gradiente verde primario → primary-container)
- Cambiar textos de `text-background/50` a `text-primary-foreground/70` y valores a `text-primary-foreground`
- El separador pasa de `bg-background/10` a `bg-white/20`
- El disclaimer pasa a `text-primary-foreground/40`
- ResultRow: labels `text-primary-foreground/70`, values `text-primary-foreground`
- El monto principal mantiene `text-primary-foreground` con alto contraste sobre el gradiente verde

### Archivos a modificar
- `src/components/landing/Hero.tsx` — hacer imagen visible en mobile
- `src/components/landing/LoanCalculator.tsx` — cambiar fondo negro a gradiente verde

