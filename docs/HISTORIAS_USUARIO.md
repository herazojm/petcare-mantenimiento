# Historias de usuario — PetCare (mantenimiento)

Módulo **Mantenimiento de Software** · Actividad 4 · Corporación Universitaria Iberoamericana
Producto base: sitio web PetCare (HTML, CSS y JavaScript puro), desarrollado en *Diseño de Aplicaciones Web I*.

Cada historia se clasifica según el tipo de mantenimiento de la norma ISO/IEC/IEEE 14764 y se implementa en su propia rama (`feature/hu-0X-…`), con su *pull request* hacia `main`.

| ID | Historia (resumen) | Tipo de mantenimiento | Prioridad | Estimación | Rama |
|---|---|---|---|---|---|
| HU-01 | Modo oscuro que se recuerda | Perfectivo | Media | 3 pts | `feature/hu-01-modo-oscuro` |
| HU-02 | Servicios favoritos | Perfectivo | Alta | 5 pts | `feature/hu-02-favoritos` |
| HU-03 | Exportar historial de citas a CSV | Perfectivo | Media | 3 pts | `feature/hu-03-exportar-csv` |
| HU-04 | Botón flotante de WhatsApp por sede | Adaptativo | Media | 2 pts | `feature/hu-04-whatsapp` |
| HU-05 | Migración de los datos guardados | Preventivo | Alta | 3 pts | `feature/hu-05-migracion-datos` |

---

## HU-01 · Modo oscuro que se recuerda

**Como** visitante de PetCare,
**quiero** cambiar entre modo claro y modo oscuro,
**para** ver el sitio con comodidad de noche o con poca luz.

**Criterios de aceptación**
1. En el encabezado de todas las páginas hay un botón con ícono de luna/sol que alterna el tema.
2. La primera vez, el sitio respeta la preferencia del sistema operativo (`prefers-color-scheme`).
3. La elección se guarda en el navegador y se aplica al volver a entrar, sin parpadeo de color.
4. Textos, tarjetas, formularios y menús mantienen un contraste legible en ambos temas.
5. El botón es accesible: tiene nombre para lectores de pantalla y `aria-pressed`.

## HU-02 · Servicios favoritos

**Como** dueño de mascota registrado,
**quiero** marcar servicios como favoritos desde el catálogo,
**para** encontrarlos rápido en «Mi cuenta» y agendarlos sin buscarlos otra vez.

**Criterios de aceptación**
1. Cada tarjeta del catálogo muestra un botón de corazón para marcar o desmarcar.
2. El estado del corazón se ve claramente (relleno = favorito) y se anuncia a lectores de pantalla.
3. En «Mi cuenta» aparece la sección «Mis favoritos» con las tarjetas marcadas.
4. Si no hay favoritos, se muestra un mensaje vacío con un enlace al catálogo.
5. Los favoritos se guardan en el navegador junto con los demás datos del usuario.

## HU-03 · Exportar historial de citas a CSV

**Como** dueño de mascota,
**quiero** descargar el historial de mis citas en un archivo CSV,
**para** abrirlo en Excel y llevar el control de gastos y servicios de mis mascotas.

**Criterios de aceptación**
1. En «Mi cuenta» › «Mis citas» hay un botón «Exportar CSV».
2. El archivo incluye: código, fecha, hora, servicio, mascota, sede, estado y total.
3. El archivo se abre bien en Excel en español (separador `;` y tildes correctas con BOM UTF-8).
4. El nombre del archivo incluye la fecha de descarga: `petcare-historial-AAAA-MM-DD.csv`.
5. Si no hay citas, el botón queda deshabilitado.

## HU-04 · Botón flotante de WhatsApp por sede

**Como** visitante con dudas,
**quiero** un botón flotante para escribirle por WhatsApp a la sede que prefiera,
**para** resolver preguntas sin tener que llamar.

**Criterios de aceptación**
1. En todas las páginas aparece un botón flotante de WhatsApp abajo a la derecha.
2. Al tocarlo se abre un panel con las tres sedes; cada una abre `wa.me` con un mensaje prellenado.
3. El panel se cierra con la tecla Esc, al tocar fuera o con el botón de cerrar.
4. En celular el botón no tapa la barra inferior de «Mi cuenta» ni el resumen fijo de «Agendar».
5. Los enlaces abren en una pestaña nueva con `rel="noopener"`.

## HU-05 · Migración de los datos guardados (preventivo)

**Como** usuario que ya usaba PetCare,
**quiero** que mis mascotas, citas y favoritos se conserven cuando el sitio se actualice,
**para** no perder mi información por los cambios de versión.

**Criterios de aceptación**
1. Los datos guardados llevan un número de versión de esquema.
2. Al cargar, si los datos son de una versión anterior (o les faltan campos nuevos como `favoritos`), se migran automáticamente.
3. Si los datos guardados están dañados, se conserva una copia de respaldo y el sitio no se rompe.
4. La lógica de migración queda documentada en el código y en el README.
