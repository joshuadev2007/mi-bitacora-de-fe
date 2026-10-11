# Mi Bitácora de Fe 3.2 — cierre de la app

## Qué quedó implementado

- 3 PDF originales del judaísmo **separados** (I: 71 páginas, II: 144, III: 121), más Libro del Islam (214), comparativo independiente (121).
- 2 guías nuevas de elaboración propia, **12 capítulos cada una**: «Cómo estudiar la Biblia con contexto» y «Tres tradiciones: cómo investigarlas». Incluyen PDF descargable y lector de texto dentro de la app.
- Nuevos botones «Leer dentro de la app» (texto), «Ver páginas originales» (PDF) y descarga de PDF; en Android y Windows el PDF se muestra con PDF.js empaquetado en la compilación (sin servidor externo).
- **Mi estantería privada**: importá PDF, TXT o MD desde el teléfono o laptop. Los archivos se guardan mediante IndexedDB **en ese dispositivo** y se leen sin subirlos a GitHub. No hay límite de cantidad predeterminado, pero cada archivo puede tener máximo 80 MB y el almacenamiento disponible depende del sistema.
- **Búsqueda de nuevas versiones** mediante GitHub Releases y enlace oficial para Android. Android exige permiso para instalar el APK; **no hay instalación automática silenciosa**. La versión web se actualiza con GitHub Pages. En Windows se conserva el soporte de actualizaciones con `electron-updater` y Releases.

## Cómo instalar 3.2 en GitHub

1. Hacé **Ajustes → Descargar respaldo JSON** en cada dispositivo donde tengas escritos. Guardalo fuera del repositorio. Tus PDF importados tampoco forman parte del respaldo JSON: conservá siempre los archivos originales.
2. Descomprimí **Mi_Bitacora_de_Fe_3_2_FINAL_COMPLETO.zip** y subí todo el contenido **a la raíz** de `joshuadev2007/mi-bitacora-de-fe` usando **Add file → Upload files**. Mantené las carpetas `.github`, `mobile`, `native`, `desktop`, `estudios`, `updates`. No subás el ZIP cerrado.
3. GitHub Pages publicará automáticamente el lector web. Para compilar Android y Windows, hay dos rutas: **Run workflow** sigue fabricando APK de pruebas y EXE; para obtener un Android **actualizable** seguí la firma y GitHub Release que se describen abajo.

## Android: una firma para todos los futuros APK

Los APK anteriores se crearon con firma de **depuración** temporal en GitHub Actions, por lo que no se puede garantizar que un APK nuevo se instale encima. Para actualizar *sin desinstalar en el futuro*, necesitás una **clave privada de publicación estable**.

1. En tu laptop instalá un JDK de Java si `keytool` no funciona. Abrí PowerShell en una carpeta **privada** que no esté dentro del repositorio y ejecutá:

   ```powershell
   keytool -genkeypair -v -keystore bitacora-release.jks -storetype PKCS12 -alias bitacora -keyalg RSA -keysize 3072 -validity 10000
   ```
   Elegí una contraseña segura y conservá el archivo `.jks` en dos lugares privados. Si pide contraseña de la clave, podés usar la misma que la del almacén. **No compartás la clave ni las contraseñas conmigo, por chat o por GitHub público.**

2. Para convertir la clave a base64 sin mostrarla públicamente:

   ```powershell
   [Convert]::ToBase64String([IO.File]::ReadAllBytes((Resolve-Path '.\bitacora-release.jks'))) | Set-Clipboard
   ```

3. En GitHub: `Settings → Secrets and variables → Actions → New repository secret`. Guardá **cuatro secretos**:

   | Nombre | Valor |
   | --- | --- |
   | `ANDROID_KEYSTORE_BASE64` | Pegá el contenido base64 del portapapeles |
   | `ANDROID_KEYSTORE_PASSWORD` | Contraseña del archivo JKS |
   | `ANDROID_KEY_ALIAS` | `bitacora` |
   | `ANDROID_KEY_PASSWORD` | Contraseña de la clave (habitualmente igual a la anterior) |

4. En GitHub → **Releases → Draft a new release**, creá la etiqueta `v3.2.0` sobre `main`, título «Mi Bitácora de Fe 3.2» y publicá. Se ejecutará el flujo `Compilar Bitacora (Android APK + Windows EXE)` automáticamente. Si falta alguna contraseña **no** se publicará el APK firmado: revisá el error y corregí los secretos.
5. Cuando el flujo Android aparezca **verde**, esperá a que la Release tenga el archivo `Mi-Bitacora-de-Fe-Android-v3.2.0.apk`. **Descargá ese, no `app-debug.apk`.**
6. **Si ahora tenés instalada la versión debug**, primero guardá un respaldo JSON y conservá tus PDF importados. Después desinstalá esa versión de prueba, instalá el APK firmado `v3.2.0` y restaurá el JSON. Desinstalar puede borrar notas y libros guardados localmente. **Es la última reinstalación necesaria siempre que conservés la misma clave, el ID de aplicación y el código de versión creciente.**

## Cómo publicar versiones posteriores

1. Editá el código, actualizá la versión de `mobile/package.json` y `desktop/package.json` (por ejemplo `3.3.0`) y subí a `main`.
2. Publicá una GitHub Release nueva etiquetada `v3.3.0` con los secretos ya configurados. El flujo construye el mismo paquete Android firmado con tu misma clave.
3. Cuando exista la nueva Release con APK, al abrir la Bitácora en Android verá el aviso desde **Ajustes → Comprobar actualizaciones** (también consulta automáticamente al entrar con internet). Tocá el enlace: se abre GitHub, descargás el APK y Android pide confirmación para instalar **encima** sin borrar datos. Esto **no** equivale a las actualizaciones silenciosas de Play Store.
4. Windows comprueba nuevas Releases con instalador y metadatos `latest.yml`. Comprobá que los dos archivos se hayan adjuntado a la Release y probá la actualización con respaldo.

### Para agregar libros sin actualizar ningún APK

Abrí **Nuestros libros → Mi estantería privada → Importar un libro** y elegí un PDF, TXT o MD en ese dispositivo. El lector abre el archivo de manera local. No hace falta modificar el código ni subirlo a GitHub. Los libros no se sincronizan entre dispositivos y no se incluyen en el JSON de respaldo; **guardá los originales**.

### Límites y privacidad

- La TNM se consulta mediante su enlace oficial en jw.org. Esta app no reproduce su texto completo con derechos de autor.
- Los libros que subas a un repositorio público serán públicos. Los libros personales importados desde el teléfono **no se suben**.
- El proyecto está preparado para las compilaciones, pero no se ha verificado una actualización firmada **de extremo a extremo** en un dispositivo físico. No afirmamos que Android se actualice solo: Android siempre solicita tu autorización.
- Tus datos actuales se guardan localmente y no se sincronizan ni se cifran. Guardá respaldos JSON de tus notas y mantené las contraseñas privadas.
