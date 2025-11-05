# Abandonados — Landing del Cortometraje

Sitio web promocional para el cortometraje "Abandonados". Incluye tráiler embebido, sinopsis, personajes principales, simbología, equipo técnico y datos de contacto. Cuenta con navegación adaptable, animaciones sutiles y un modal para ver el video.

## Características

- **Tráiler** embebido (YouTube) y **modal** de reproducción con cierre por X, fondo y tecla Escape (detiene el video al cerrar).
- **Secciones**: Tráiler, Sinopsis, Personajes, Simbología, Equipo, Contacto.
- **Navegación responsive** con menú hamburguesa y realce del link activo según scroll.
- **Animaciones** de aparición al hacer scroll.
- **Fuentes personalizadas**: Zuume Rough (Regular/Bold) incluidas localmente.

## Tecnologías

- HTML5
- CSS3 (layout responsive, animaciones, backdrop-filter)
- JavaScript (interacciones: navbar, smooth scroll, modal)

## Estructura del proyecto

```
CountdownPage/
├─ index.html
├─ styles.css
├─ main.js
├─ fonts/
└─ imgs/
```

## Comportamiento del modal

- Se abre automáticamente en dispositivos móviles (<= 768px) al cargar.
- En escritorio no se abre automáticamente.
- Cierre por:
  - Botón `×`.
  - Click en el fondo fuera del contenido.
  - Tecla Escape.
- Al cerrar, el reproductor se detiene reiniciando el `src` del iframe.

## Fuentes

Las fuentes están servidas localmente. Asegúrate de mantener nombres y rutas con mayúsculas/minúsculas exactas (importante en producción):

```
@font-face {
  font-family: "Zuume Rough Bold";
  src: url("fonts/ZuumeRough-Bold.ttf") format("truetype");
}
@font-face {
  font-family: "Zuume Rough";
  src: url("fonts/ZuumeRough-Regular.ttf") format("truetype");
}
```

## Desarrollo local

1. Clonar o descargar el proyecto.
2. Abrir `index.html` en un navegador moderno.
3. Para probar fuentes y rutas como en producción, servir con un servidor estático (por ejemplo, VS Code Live Server).

## Buenas prácticas aplicadas

- Navbar fija con **padding dinámico** del body en móviles para evitar saltos.
- **Smooth scroll** con compensación de altura del navbar.
- **Preload** simple de imágenes clave.
- **Animaciones** de entrada progresivas.
- Diseño responsive a 1024px, 768px y 480px.

## Accesibilidad y rendimiento

- Imágenes con `alt` descriptivo y `loading="lazy"` donde aplica.
- Contraste alto y textos legibles.
- Reducción de reflows al calcular offsets y cerrar menú móvil antes de scrollear.

## Despliegue

- Es un sitio estático, compatible con Netlify, GitHub Pages, Vercel, etc.
- Verifica en producción:
  - Rutas de `fonts/` (sensibles a mayúsculas/minúsculas).
  - Tipos/MIME para fuentes (`font/ttf`).
  - Cabeceras CSP si existieran (`font-src 'self'`).

## Contacto

- Productora (Instagram): https://www.instagram.com/beyond.estudios
- Película (Instagram): https://www.instagram.com/abandonadoscortometraje
- WhatsApp: https://wa.me/5493794935091
- Email: beyondstudios.av@gmail.com
