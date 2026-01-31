<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Menú digital (React + Vite)

Menú de restaurante minimalista:
- muestra categorías y productos
- carrito
- envío del pedido por WhatsApp
- panel de administración para editar datos del restaurante y el menú

> Nota: esta app no depende de Gemini/AI Studio. Es un proyecto frontend normal.

## Requisitos
- Node.js (recomendado: LTS)

## Correr local
```bash
npm install
npm run dev
```

Luego abrí: http://localhost:3000

## Build
```bash
npm run build
npm run preview
```

## Personalización por restaurante (sin tocar código)
Este repo está preparado para que cada restaurante tenga su menú con solo editar archivos JSON.

Editá:
- `public/config/restaurant.json` (datos, logo, colores, plantilla WhatsApp)
- `public/config/menu.json` (productos)

La primera vez que abras la web, el setup de admin se precarga con esos datos. Luego el dueño puede editar desde el panel de administración (se guarda en el navegador).

## Configuración (fallback)
Si faltan esos JSON, se usa un fallback en `config.ts`.
