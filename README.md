# PetCare 🐾 — Mantenimiento de Software

Sitio web responsivo para **PetCare**, una red ficticia de servicios para mascotas en Medellín (veterinaria, baño y peluquería, paseos, guardería y adiestramiento).

Este repositorio se usa en el módulo **Mantenimiento de Software** (Actividad 4 · Utilizando sistemas de control de versiones) de la Corporación Universitaria Iberoamericana. El producto base se construyó en *Diseño de Aplicaciones Web I* y aquí se le hace mantenimiento con Git y GitHub: cada cambio nace de una historia de usuario, se trabaja en una rama propia y entra a `main` por *pull request*.

- Autor: **Jesua Herazo Moreno**
- Docente: Rogelio Vásquez
- Historias de usuario: [`docs/HISTORIAS_USUARIO.md`](docs/HISTORIAS_USUARIO.md)

> PetCare es una marca ficticia con fines académicos.

## Qué hace

| Página | Funcionalidad |
|---|---|
| `index.html` | Hero, servicios destacados, cómo funciona, testimonios, banner y sedes |
| `servicios.html` | Búsqueda, filtros combinables, píldoras quitables, orden, paginación, filtros en la URL |
| `servicio.html?id=…` | Galería, precio según tamaño, qué incluye, profesionales, preguntas frecuentes |
| `agendar.html` | 3 pasos, calendario, horarios ocupados, validación, descuento 10 % primera cita |
| `confirmacion.html` | Resumen de la cita y descarga `.ics` para el calendario |
| `ingresar.html` | Ingresar / crear cuenta y cuenta de demostración |
| `mi-cuenta.html` | Mascotas, próximas citas (reprogramar / cancelar), historial, perfil |
| `proyecto.html` | Video de demostración, trazabilidad wireframe → código, aviso legal |

## Tecnologías

- **HTML5** semántico y **CSS3** (variables, Grid, Flexbox, `clamp()`), sin frameworks.
- **JavaScript** puro: Web Components (`<pc-header>`, `<pc-footer>`) y `localStorage`.
- Fuentes Nunito e Inter auto-alojadas (SIL OFL) · Íconos Lucide (ISC) · Ilustraciones SVG propias.

## Estructura

```
├── index.html, servicios.html, servicio.html, agendar.html,
│   confirmacion.html, ingresar.html, mi-cuenta.html, proyecto.html, 404.html
├── docs/                       ← historias de usuario del mantenimiento
└── assets/
    ├── css/styles.css          ← sistema de diseño
    ├── fonts/                  ← Nunito e Inter (woff2)
    ├── img/favicon.svg
    └── js/
        ├── config.js           ← enlaces del video, del repo y de Figma
        ├── icons.js, illustrations.js, data.js, store.js, components.js
        └── pages/              ← un script por página
```

## Probarlo en tu PC

Con un servidor local (con doble clic las fuentes no cargan por seguridad del navegador):

```bash
git clone https://github.com/herazojm/petcare-mantenimiento.git
cd petcare-mantenimiento
python -m http.server 8000
# abre http://localhost:8000
```

## Flujo de trabajo con Git

1. Cada historia de usuario tiene su rama: `feature/hu-0X-nombre`.
2. Los cambios se agregan con `git add` y se guardan con `git commit` (mensajes en español, en presente).
3. La rama se sube con `git push -u origin <rama>` y se abre un *pull request* hacia `main`.
4. Al aprobarlo se fusiona con *merge commit* para que el historial muestre cada historia.

## Privacidad

No hay servidor: los datos (sesión, mascotas y citas) se guardan solo en el navegador con `localStorage`. Las contraseñas no se guardan.
