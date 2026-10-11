# Una cuenta para JoshOS y Mi Bitácora de Fe

## Antes de nada
Exportá un respaldo JSON de **cada app y cada dispositivo** en Ajustes. No desinstalés las apps antiguas antes de comprobar la sincronización.

## Configuración UNA SOLA VEZ en Supabase

1. Abrí https://supabase.com/dashboard y creá un proyecto personal de Supabase (la cuenta y el proyecto pueden estar en el plan gratuito; pueden existir límites).
2. Entrá en **SQL Editor**, creá una consulta y pegá el archivo `CONFIGURAR_SUPABASE.sql` completo. Ejecutálo. Activa RLS y permite ver los propios datos únicamente a cada usuario autenticado.
3. En Authentication -> Providers verificá que Email esté habilitado. Para mayor seguridad, mantené **Confirm email** activado (deberás confirmar el mensaje que te envíen).
4. En Project Settings -> API Keys, buscá **Project URL** y la clave **publishable** (o **anon**, según el panel). **NUNCA** utilicés `service_role` ni `sb_secret_...` en una app, chat, archivo o GitHub.
5. En JoshOS y en Mi Bitácora, tocá **☁️ Cuenta**, pegá la URL y la clave pública y guardá. Este paso se repite en cada app y dispositivo (no requiere volver a ejecutar SQL).
6. En una app, **Crear cuenta** con correo y contraseña; si recibís mensaje de confirmación, confirmálo y luego pulsá Entrar.
7. En el otro dispositivo, **Entrar** con el MISMO correo y contraseña. Ambas apps usan un mismo usuario de Supabase, pero guardan sus contenidos por separado.

## Primera sincronización: conservá tus apuntes

- Al tener datos diferentes en nube y dispositivo, **la app NO sobrescribe nada en automático**: muestra un aviso por cada módulo.
- Hacé respaldo antes de tocar un botón. **Usar copia de nube** reemplaza la copia local del módulo. **Usar copia de este equipo** reemplaza la copia de nube de ese módulo.
- Si tenés cambios únicos tanto en PC como Android, exportá los respaldos de ambos antes de elegir: no hay fusión automática de notas individuales.
- JoshOS también sincroniza los datos del módulo Bitácora de Fe y LevelUp cuando están incorporados a JoshOS, usando los mismos registros por usuario. Esto no comparte los datos de dos personas distintas.
- Podés trabajar sin conexión. Al volver la conexión y estar la sesión iniciada, los cambios JSON pendientes se subirán. Mantené la app abierta unos instantes para que termine.
- Podés tocar **Sincronizar ahora** para verificar y pedir la última copia disponible en la nube.
- PDF y otros archivos importados de tu almacenamiento personal NO se suben en este sistema, solo los registros guardados como JSON. Los libros incluidos en la app siguen funcionando sin internet.
- Las notas de los módulos NO están cifradas de extremo a extremo: Supabase conserva los datos y puede aplicar sus políticas de seguridad. La bóveda de JoshOS sí sigue almacenándose como texto cifrado en su propia estructura.
- No se suben claves privadas ni contraseñas: la autenticación usa Supabase. Las sesiones se guardan localmente en cada dispositivo; mantenelo protegido.

## Publicar y generar APK / EXE

Actualizá los archivos con los ZIP de este paquete, manteniendo la estructura de cada repositorio. Recompilá Android y Windows desde Actions: **la versión instalada previamente no obtiene el inicio de sesión sin actualizar el programa**. En web, recargá y comprobá la nueva opción **☁️ Cuenta**. Configurá la URL y la clave pública en cada app desde la interfaz, sin necesidad de editar código.

IMPORTANTE: Los repositorios y las apps web pueden ser públicos; eso NO hace públicas las notas si las políticas RLS de Supabase están aplicadas. No subás respaldos JSON, contraseñas ni service keys a GitHub. No desactives RLS.
