

## Plan: Logotipo tipográfico para Adelanto Ya

### Concepto
Crear un logotipo tipográfico usando Plus Jakarta Sans (la fuente headline del proyecto) con un acento gráfico sutil — una flecha ascendente integrada en la "A" o un subrayado dinámico en verde primario que sugiera movimiento y progreso financiero.

### Pasos

1. **Generar 3 variantes del logotipo** usando el modelo de generación de imágenes (Nano banana pro para mayor calidad):
   - **Variante A**: "Adelanto Ya" con la "A" inicial estilizada con una flecha ascendente sutil, fondo transparente, colores #006e2a y #1a1c1e
   - **Variante B**: "Adelanto Ya" con un underline dinámico verde degradado bajo "Ya", tipografía bold moderna
   - **Variante C**: "Adelanto Ya" con un punto verde brillante reemplazando el punto de la "i" (si hubiera) o como acento en la "Y", minimalista

2. **Exportar las 3 opciones** como PNG a `/mnt/documents/` para que puedas verlas y elegir

3. **Tras tu elección**, integrar el logo seleccionado en:
   - `Header.tsx` — reemplazar el div con Wallet icon
   - `Footer.tsx` — reemplazar el div con Wallet icon  
   - `TopBar.tsx` — reemplazar el div con Wallet icon
   - `favicon` en `index.html`

### Notas técnicas
- El logo se generará en formato PNG con fondo transparente
- Se creará en tamaño adecuado para header (36-40px height) y favicon (32x32, 16x16)
- Se mantendrá el verde primario (#006e2a → #00c96a gradient) como color principal

