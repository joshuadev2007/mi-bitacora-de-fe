# Mi Bitácora de Fe — Versión final 3.2

**Ahora incluye estantería privada para importar libros, lector interno de PDF y texto, dos guías originales y Android preparado para actualizaciones firmadas desde Releases.**

**Instrucciones completas:** [ULTIMO_PASO_ANDROID_Y_LIBROS.md](./ULTIMO_PASO_ANDROID_Y_LIBROS.md).

**Crítico:** para pasar del APK debug antiguo a un APK firmando permanentemente, respaldá las notas y los libros y seguí la migración de Android de la guía. Sin los cuatro secretos de firma, el flujo **NO** puede publicar un APK Android actualizable. No subas claves privadas, libros personales ni respaldos al repositorio público.

---

# Mi Bitácora de Fe · Versión 3.1.0

**Novedad:** lector de estudios dentro de la aplicación, volúmenes originales del judaísmo por separado y soporte de comprobación de versiones. Para pasos de instalación y límites de las actualizaciones consultá [ACTUALIZACIONES_Y_LECTOR.md](./ACTUALIZACIONES_Y_LECTOR.md).

---

# Mi Bitácora de Fe — Edición FINAL 3.0 ✦

## NUEVO en esta edición

- Versículo diario rotativo con referencia, pregunta abierta y texto consultado por GetBible en RV 1909 (cuando hay conexión), registro de lectura y botón de reflexión.
- **Nuestros libros**: los tres PDF originales completos (394 + 214 + 121 páginas), con un buscador local de texto por página y enlaces a las páginas exactas.
- 20 fichas temáticas para convertir en investigaciones propias, sin atribuir una conclusión al usuario.
- **TNM oficial**: disponible en el selector de traducciones, tanto en lector como en comparación. Por derechos de autor la app NO redistribuye el texto; abre jw.org y permite guardar notas personales sobre la referencia.
- Conserva el resto de funciones de 2.0 (biblioteca, diario, planos, investigaciones, calendario, oraciones, mini-Shabat, versiones históricas, comparador, datos locales y respaldo).

## ACTUALIZAR SIN PERDER NOTAS

**ANTES DE HACER CAMBIOS: Ajustes → Descargar respaldo JSON.** Conservá ese archivo fuera de GitHub.

Subí a la raíz de tu repositorio **todos los archivos del ZIP**, incluida la carpeta `estudios` con sus tres PDF y `indice.json`. Reemplazá `index.html`, `app.js`, `style.css`, `sw.js` y `README.md` (y cualquier archivo coincidente). No subás la carpeta que contiene todo; `index.html` debe quedar en la raíz. Guardá con **Commit changes**. GitHub Pages actualizará el mismo enlace.

Para comprobar la actualización, forzá recarga (`Ctrl + Shift + R`) y cerrá/reabrí la aplicación instalada si fuera necesario. El service worker usa la versión `bitacora-fe-final-v3`.

El código sigue utilizando la misma clave local `mi-bitacora-fe-v1`, sin cambiar tus notas existentes; se agregan las claves `daily` y `tnmNotes` a los respaldos. **No uses incógnito ni borres datos del navegador**: esos datos son personales de cada dispositivo/perfil y no hay sincronización. Las restauraciones JSON reemplazan los datos existentes.

## DERECHOS Y PRIVACIDAD

- TNM © Watchtower Bible and Tract Society. Se consulta en https://www.jw.org/es/biblioteca/biblia/ ; no se distribuye ni se descarga su texto desde la app.
- Los libros de investigación PDF incluidos en el ZIP se harán **públicamente accesibles** si publicás este proyecto en un GitHub Pages público. Revisá que querás publicar estos documentos antes de subir el ZIP.
- No subás tu diario, oraciones, respaldos ni notas personales al repositorio. Se almacenan localmente, no están cifrados.
- Las biblias antiguas consultadas mediante GetBible requieren internet la primera vez que se abre un capítulo nuevo; luego algunos capítulos quedan en caché.
- Los PDFs pueden requerir conexión la primera vez; el navegador puede guardarlos en caché tras abrirlos.

# Mi Bitácora de Fe ✦ — Edición Épica 2.0

Tu aplicación personal de estudio, escritura y reflexión espiritual: **hecha como PWA para GitHub Pages** y optimizada para PC y celulares. No requiere cuenta ni servidor propio.

## Novedades de esta edición

- **La Biblia**: selección de los 66 libros, navegación por capítulos, salto a referencia, guardado de versículos y registro voluntario de lectura.
- **Cuatro traducciones**: Reina-Valera 1909 (`valera`, español), Sagradas Escrituras 1569 (`sse`, español), Reina-Valera 1858 (`rv1858`, español, **solo Nuevo Testamento**) y King James (`kjv`, inglés). Fuente: [GetBible API v2](https://getbible.net/api/bible/v2/).
- **Comparador**: dos traducciones bíblicas lado a lado, por versículo.
- **Centro de investigaciones**: pregunta central, textos, referencias, fuentes, argumentos, puntos de vista distintos, conclusión provisional y estado. Las fichas se pueden editar, consultar y borrar.
- **Planes de lectura**: cuatro planes de siete lecturas cada uno, con progreso guardado.
- **Calendario personal**: actividad de diario y oraciones, lectura marcada y pequeño ritual diario.
- **Accesos directos** en Inicio, navegación renovada y diseño responsivo.

### Funciones originales que siguen disponibles

- Diario espiritual con favoritos, etiquetas, fechas, referencias y volúmenes.
- Biblioteca con seis volúmenes base y volúmenes personalizados.
- Mis versículos; oraciones e intenciones; mini-Shabat personal.
- Búsqueda de apuntes, temas y reflexiones.
- Temas claro/oscuro y tamaño de letra.
- Exportación JSON, restauración JSON y exportación Markdown del diario.
- Instalación como aplicación web progresiva (PWA) en dispositivos compatibles.

## IMPORTANTE: actualizar sin perder tus notas

**Antes de actualizar**, abrí la versión antigua en el navegador que usás y entrá a **Ajustes → Descargar respaldo JSON**. Guardá el archivo de manera privada.

La versión 2.0 usa **la misma clave local (`mi-bitacora-fe-v1`)** que la versión anterior. Si mantenés la **misma dirección del sitio, navegador y perfil** y no borrás los datos del navegador, las notas antiguas permanecen disponibles. La versión nueva añade campos compatibles sin borrar las entradas anteriores.

Para actualizar tu repositorio de GitHub Pages:

1. Entrá a tu repositorio `mi-bitacora-de-fe` en GitHub.
2. Sustituí `app.js`, `style.css`, `index.html`, `sw.js` y `README.md` por los archivos del ZIP de actualización (o subí todos los del ZIP completo, reemplazando los existentes). Mantené `index.html` en la raíz.
3. Confirmá los cambios con **Commit changes**. La rama `main` y la configuración de GitHub Pages **no necesitan cambiar**.
4. Esperá a que GitHub Pages publique los cambios y recargá el sitio. Podés usar `Ctrl+Shift+R` en PC, o cerrar y volver a abrir la PWA en el celular. La caché del Service Worker cambia de versión.
5. Revisá tus apuntes. Si faltara alguno, entrá a Ajustes y restaurá el respaldo privado JSON.

No subás tu archivo de respaldo JSON, oraciones personales o anotaciones privadas al repositorio, especialmente si es público.

## Cómo funciona el lector bíblico

- Los capítulos son solicitados a **GetBible API v2** por HTTPS, sin registro de usuario. Para leer un capítulo nuevo necesitás internet; los últimos **25 capítulos abiertos** se mantienen en caché local en ese navegador, si hay suficiente espacio.
- Los textos bíblicos no vienen incluidos en el ZIP. Este diseño evita descargar muchos megabytes y permite cambiar traducciones desde el lector. El lector muestra un aviso comprensible si no hay conexión, la fuente no responde o la traducción no cubre el libro seleccionado.
- Las versiones antiguas indicadas están disponibles como textos de dominio público en GetBible. La Biblia `rv1858` incluye solo el Nuevo Testamento en su edición de la API.
- Para versiones modernas como RVR1960, NVI o Traducción del Nuevo Mundo, se ofrecen **enlaces externos a sitios que las publican**. No se copian textos protegidos sin permiso.
- La app envía a GetBible solo la identificación de la traducción, el número de libro y capítulo solicitados. **No envía tus diarios ni tus oraciones**.
- La comparación bíblica es una herramienta de lectura: no determina automáticamente cuál doctrina es correcta.

## Privacidad y respaldo

- Diario, oraciones, versículos guardados, investigaciones, planes y calendario viven **en el almacenamiento local del navegador**. No tienen sincronización entre dispositivos, cuenta, cifrado ni control de acceso.
- Un navegador ajeno o una persona con acceso al mismo perfil podría leerlos. No uses la app para secretos que requieran protección fuerte.
- Borrar datos del navegador, usar otra computadora o cambiar la dirección del sitio puede hacer que tus notas no aparezcan. Descargá el respaldo JSON con regularidad y guardalo fuera de un repositorio público.
- La restauración JSON **reemplaza** los datos presentes en el dispositivo; se recomienda exportar una copia antes de restaurar.
- No cuenta con recordatorios del sistema, notificaciones programadas ni cuentas en la nube.

## Publicación inicial en GitHub Pages

1. Colocá `index.html`, `style.css`, `app.js`, `manifest.webmanifest`, `sw.js`, ambos íconos PNG y `.nojekyll` en la raíz.
2. **Settings → Pages → Deploy from a branch → `main` → `/(root)` → Save**.
3. Abrí la dirección de GitHub Pages y elegí *Instalar aplicación* cuando el navegador lo permita.
4. GitHub Pages en una cuenta personal gratuita normalmente requiere repositorio **público**; nunca subás notas privadas al repositorio.

**No hay pasos de compilación ni dependencias de Node.** La aplicación es HTML, CSS y JavaScript sin frameworks.

## Fuentes

- Texto bíblico y API: https://getbible.net/api/bible/v2/
- API de consulta de pasajes: https://getbible.net/api/query/v2/
- Lectura de traducciones modernas: https://www.bible.com/es/versions , https://www.biblegateway.com/versions/ y https://www.jw.org/es/biblioteca/biblia/
