# Mi Bitácora de Fe 3.1 · lector y actualizaciones

## Qué incluye ahora

- **Tres PDF independientes originales** del judaísmo, recuperados por separado en vez de dividir el integral defectuoso:
  - Vol. I: 71 páginas (edición retro original).
  - Vol. II: 144 páginas (edición anotada original).
  - Vol. III: 121 páginas (edición comparativa original).
  - El PDF integral se conserva por compatibilidad en `estudios/EL_LIBRO_DEL_JUDAISMO.pdf`, pero la biblioteca ya no lo utiliza.
- **Lector dentro de la app** para judaísmo, islam y estudio comparativo: páginas, búsqueda, página recordada, favoritos, tema claro/oscuro y tamaño de letra. Los libros en PDF originales están disponibles también para descargar. Cuando la extracción de texto de un PDF resulte imperfecta, se puede consultar el PDF como referencia visual.
- **Comprobación de versiones** en Ajustes y aviso al inicio, sin enviar notas personales.
- **Windows Electron:** cuando exista una **GitHub Release oficial** publicada con los archivos adecuados (`latest.yml` y instalador NSIS), `electron-updater` puede descargar la nueva versión y pedir permiso para instalarla. En versiones sin firma comercial, Windows puede mostrar avisos; confirmar una instalación real requiere pruebas con la versión publicada.
- **Web/PWA:** Github Pages publica el código automáticamente y el service worker se renueva al cambiar su nombre de caché.
- **Android:** los cambios en el APK requieren una actualización de la aplicación firmada con **la misma clave**. Android no permite que esta app instale silenciosamente APKs por sí sola. El enlace en Ajustes avisa de una nueva versión oficial; la instalación se hace desde el sistema Android. Para actualizaciones automáticas gestionadas se necesitaría una distribución vía Play Store u otra tienda que las admita.

## Cómo poner la versión 3.1 en GitHub

1. **Primero exportar un respaldo JSON** desde Ajustes en la app que ya usás. No subas los respaldos a GitHub.
2. Extraé `Mi_Bitacora_de_Fe_3_1.zip` y subí su contenido a la raíz del repositorio (no la carpeta contenedora). Todos los archivos existentes deben reemplazarse por su nueva versión; añadí los volúmenes PDF, el directorio `estudios/lecturas` y los archivos `leer.*`.
3. **Importante:** al subir con la web de GitHub podés arrastrar las carpetas completas desde el explorador. GitHub puede limitar el número de archivos y el tamaño de cada subida.
4. La web de GitHub Pages cambiará con el siguiente despliegue. Las versiones APK y EXE antiguas **no** incorporan el actualizador; hay que compilar e instalar la 3.1 por primera vez.
5. Desde GitHub → Actions → Compilar Bitacora (Android APK + Windows EXE) → Run workflow, generá instaladores para probar. El APK de depuración **no puede garantizar actualizaciones in situ** porque GitHub Actions puede usar claves de firma de prueba diferentes en cada ejecución.

## Publicar futuras actualizaciones de Windows

1. Incrementar `version` en `desktop/package.json`, y `mobile/package.json` si cambia Android; actualizar `updates/latest.json` cuando corresponda.
2. Crear una nueva **Release** en GitHub con etiqueta `v3.2.0` (ejemplo), una vez que el código actualizado esté en la rama principal. La acción iniciada por `release.published` compilará e intentará adjuntar instaladores y metadatos para Windows.
3. Con una Release nueva correcta, el EXE 3.1+ detecta y descarga actualizaciones, y pregunta antes de reiniciar.
4. Probar primero en otra máquina o con respaldo; no confundir `Artifacts` (que expiran) con `Releases` (distribución de actualizaciones).

## Firma permanente Android, necesaria antes de próximas actualizaciones

La versión de depuración previa se firmó con claves temporales de GitHub Actions. Puede ser necesario **desinstalarla una vez** para pasar a una versión de publicación firmada con una clave tuya. Desinstalar Android puede borrar datos locales: **exportá un JSON** primero y restauralo después.

Para generar y guardar una firma estable, usá Android Studio/keytool en un equipo seguro, **guardá la clave y las contraseñas fuera del repositorio**, y configurá estos cuatro secretos de GitHub Actions en Settings → Secrets and variables → Actions:

- `ANDROID_KEYSTORE_BASE64`: contenido base64 del archivo `.jks` generado localmente (no publicarlo en chats ni commits).
- `ANDROID_KEYSTORE_PASSWORD`: contraseña de almacén.
- `ANDROID_KEY_ALIAS`: alias del certificado.
- `ANDROID_KEY_PASSWORD`: contraseña de la clave.

Con los cuatro secretos, el flujo de Release compila `assembleRelease` y sube un APK firmado. Verificá la firma, versión y capacidad de instalar sobre la versión anterior **antes** de depender de actualizaciones en Android. No incluyas jamás la clave ni las contraseñas en un repositorio público.

## Privacidad y acceso a tus libros

- Los libros se publicarán con la web en GitHub Pages, por lo que otras personas podrán descargarlos desde el repositorio público. Si tus estudios son privados, deberíamos usar un almacenamiento privado antes de publicarlos.
- Los apuntes personales siguen en el navegador/dispositivo, no en GitHub. Las actualizaciones de código no sincronizan automáticamente las bases de datos locales de Android, Windows y web.
- La información bíblica de fuentes externas sigue necesitando internet. Los libros empaquetados y los textos extraídos funcionan sin internet en Android y Windows.
