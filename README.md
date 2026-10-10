# Mi Bitácora de Fe ✦

Una aplicación personal tipo **PWA**, diseñada para llevar un diario espiritual, guardar versículos, organizar estudios por volúmenes, registrar oraciones y reflexionar durante un mini-Shabat semanal.

## Funciones
- Inicio con lectura sugerida, pregunta para reflexionar, estadísticas y actividad de escritura.
- Diario de reflexión: título, fecha, tipo, referencias bíblicas, volumen, etiquetas, favoritos, búsqueda y edición.
- Biblioteca: volúmenes editables, preguntas guía, creación de nuevos volúmenes y asociación de entradas.
- Versículos: referencias, transcripción opcional desde tu propia Biblia y reflexión personal.
- Oraciones, agradecimientos e intenciones personales.
- Mini-Shabat: guía semanal opcional, lista de pasos y diario dedicado.
- Búsqueda global por textos, versículos, oraciones y volúmenes.
- Modo claro/oscuro, tipografía normal/grande, copia de seguridad JSON, restauración y exportación Markdown.
- Instalación en Android/PC como PWA y modo sin conexión después de la primera visita completa.

## Cómo publicarla en GitHub Pages
1. Creá un nuevo repositorio en GitHub (por ejemplo `mi-bitacora-de-fe`).
2. Subí **el contenido de esta carpeta**, incluidos `index.html`, `style.css`, `app.js`, los íconos, `manifest.webmanifest` y `sw.js`. `index.html` debe quedar en la raíz.
3. Abrí **Settings → Pages**.
4. En **Build and deployment**, seleccioná **Deploy from a branch**, rama **main** y carpeta **/(root)**. Guardá.
5. Abrí la dirección de Pages que te indique GitHub. Desde el navegador podés agregar la app a la pantalla de inicio si el dispositivo ofrece la opción.

No hace falta `npm install`, compilar ni configurar una clave de API.

## Ejecutarla en tu computadora

En la carpeta, ejecutá:

```bash
python -m http.server 8000
```

Luego abrí `http://localhost:8000/`. La primera visita en modo PWA requiere conexión para cargar los archivos, después funciona sin conexión (la fuente web puede usar su alternativa local).

## Privacidad y límites
- Los contenidos se almacenan con `localStorage` en el navegador y **no se envían a servidores**.
- **NO hay cifrado**, sincronización, cuenta de usuario ni controles de acceso. Cualquier persona que acceda a ese perfil del navegador podría leer las notas.
- Borrar el almacenamiento del navegador o cambiar de dispositivo puede causar pérdida de datos. Usá con frecuencia **Ajustes → Descargar respaldo .json** y guardalo de forma privada.
- **Nunca** guardés el respaldo JSON o tus notas personales en un repositorio público. El repositorio debe contener **solo el código** de la app.
- GitHub Pages es una web pública, aunque los datos personales escritos dentro de ella no se publiquen automáticamente.
- Las referencias bíblicas sugeridas incluyen solo referencias y preguntas originales: podés transcribir desde la versión de la Biblia de tu preferencia.
- La guía del mini-Shabat es una práctica personal y no una descripción normativa del Shabat judío.

## Estructura del proyecto

```text
mi-bitacora-de-fe/
├── index.html
├── style.css
├── app.js
├── manifest.webmanifest
├── sw.js
├── icon-192.png
├── icon-512.png
└── README.md
```

## Próximas funciones posibles
- Sincronización privada entre dispositivos con inicio de sesión y control de acceso real.
- Citas bibliográficas y fuentes organizadas por investigación.
- Exportación PDF y diario por volúmenes.
- Recordatorios configurables que funcionen con un servicio autorizado.
