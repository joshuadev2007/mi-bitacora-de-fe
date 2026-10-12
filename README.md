# Mi Bitácora de Fe 3.4 · Explorador de versículos

Actualización de la app original de Bitácora de Fe. Conserva las notas, investigaciones, oraciones, biblioteca, comparador, planes y copia JSON del formato `mi-bitacora-fe-v1`.

## Nuevo: descubrir versículos

En «Mis versículos», probá **Nuevo versículo al azar**: elige una referencia de un catálogo curado, intenta mostrar el texto Reina-Valera 1909 (si hay conexión), permite **Guardar versículo** y **Reflexionar** con la referencia ya precargada. Podés abrir el capítulo completo, consultar el contexto y editar tus apuntes después. Las referencias se muestran sin conexión; la consulta del texto puede requerir internet.

## Josh Cloud

La cuenta Supabase viene preconfigurada con URL y clave **pública**. Iniciá sesión con el mismo correo y contraseña en tus dispositivos. No insertés `service_role` ni `sb_secret_`. La nube sincroniza registros JSON por módulo y avisa si hay dos copias distintas; no sincroniza PDF importados personalmente.

## Publicar y actualizar

**Primero**: Ajustes → Descargar respaldo JSON, y conservar por separado tus PDF personales. Para actualizar, extraé el ZIP de actualización y cargá los archivos **en la raíz** del repositorio `joshuadev2007/mi-bitacora-de-fe` preservando rutas. Comprobá la web antes de ejecutar `.github/workflows/compilar-apps.yml`. El proyecto prepara los recursos nativos para Android y Windows, pero el instalador compilado debe probarse por separado.
