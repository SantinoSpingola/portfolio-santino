# Portfolio Santino Spingola

## Deploy rápido

Doble click en `index.html` — funciona directamente desde el browser. Sin servidor, sin build.

## Estructura

```
Portfolio Santino/
├── index.html         ← abrir este
├── styles/
│   └── main.css
├── js/
│   └── main.js
└── README.md
```

## Personalización frecuente

### Actualizar progreso de certificaciones

En `js/main.js`, al inicio del archivo:

```js
const CERTIFICATIONS = [
  { name: "Claude 101", completed: true },   // ← cambiar a true cuando esté listo
  ...
];
```

Cambiar `completed: false` a `completed: true` en los cursos completados.
La barra de progreso y el contador se actualizan automáticamente.

### Agregar links de verificación

```js
const CERT_URLS = [
  "https://link-certificado-1.com",
  "https://link-certificado-2.com",
  "#",  // ← pendiente
  ...
];
```

### Cambiar datos de contacto

En `index.html`, buscar `santinospingola12@gmail.com` y reemplazar.

## Deploy en producción

Cualquier hosting estático funciona:
- **Netlify**: arrastrar la carpeta a netlify.com/drop
- **Vercel**: `vercel --prod` desde la carpeta
- **GitHub Pages**: subir y activar en Settings → Pages
- **Hostinger**: subir via FTP a `public_html/`
