# Mi Bitácora de Fe: Android APK + Windows EXE

Este paquete **no contiene ejecutables ya compilados**. Agrega un flujo de GitHub Actions que los construye en servidores de GitHub. Se integra con la versión 3.0 del proyecto sin cambiar su web actual.

## Construir sin instalar herramientas de programación

1. Colocar `native/`, `desktop/`, `mobile/` y `.github/workflows/compilar-apps.yml` en la **raíz** del repositorio `joshuadev2007/mi-bitacora-de-fe`. Estos archivos ya se pueden añadir desde ChatGPT cuando la conexión a GitHub lo permita.
2. Abrir el repositorio en GitHub, pestaña **Actions**.
3. Elegir el flujo **Compilar Bitacora (Android APK + Windows EXE)**.
4. Pulsar **Run workflow**, elegir rama `main` y confirmar **Run workflow**.
5. Esperar a que terminen los trabajos de Android y Windows (pueden tardar varios minutos). Abrir la ejecución completada.
6. Al final, en **Artifacts**, descargar **Bitacora-de-Fe-Android-APK** y **Bitacora-de-Fe-Windows-EXE**.
7. Extraer cada ZIP. En el primero habrá `app-debug.apk`, instalable en Android mediante descarga manual y autorización de instalación externa. En el segundo, el instalador EXE y el EXE portable.

## Sobre los archivos y la privacidad

- La web en GitHub Pages no se altera. Las apps incluyen todas las pantallas y los tres PDF de estudios; el APK incorpora un lector PDF sin internet.
- En Windows, los PDF se abren con la aplicación PDF predeterminada de Windows.
- El lector de traducciones bíblicas de GetBible **necesita internet** para capítulos no consultados anteriormente. La TNM se abre en jw.org.
- Los datos de la web, Android y Windows **no se sincronizan automáticamente**. Antes de cambiar de dispositivo, exportá el respaldo JSON de tu Bitácora actual y luego usá **Restaurar respaldo** en el nuevo dispositivo.
- El APK será una compilación de **depuración** firmada automáticamente por Android. Sirve para instalar y probar personalmente; no es una versión de distribución para Google Play. Para futuras actualizaciones conservando datos, se debe mantener la misma clave de firma, por lo que conviene una firma privada de lanzamiento al pasar a producción.
- El EXE no está firmado con un certificado comercial; Windows SmartScreen puede mostrar advertencia. No desactives protecciones globalmente. Podés revisar el código, el origen del build y decidir si ejecutarlo.
- Cada app guarda las notas y oraciones en almacenamiento local del dispositivo, por lo que conviene exportar respaldos JSON con regularidad.

## Repetir una compilación cuando actualices la app

Si modificás `index.html`, `app.js`, `style.css`, los íconos o los libros en `estudios/`, simplemente volvé a ejecutar el flujo desde Actions. Ambos instaladores incorporarán los archivos nuevos.

## Arquitectura

- `desktop/`: contenedor Electron, empaqueta un instalador Windows (NSIS) y versión portable.
- `mobile/`: contenedor Capacitor, lector PDF.js integrado, exportación de respaldos por menú Compartir de Android.
- `native/`: copia de activos, generación de iconos y adaptaciones de build sin tocar la web original.
- `.github/workflows/compilar-apps.yml`: ejecuta builds remotos en GitHub Actions.
