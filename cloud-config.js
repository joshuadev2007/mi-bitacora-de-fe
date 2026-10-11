/* Josh Cloud: configuración pública compartida entre web, Windows y Android.
   Solo debe contener la URL y la clave PUBLICABLE (sb_publishable_...).
   Nunca uses service_role, sb_secret_ ni contraseñas de usuario. */
window.CloudDefaultConfig = {
  url: "https://pdgfayuuovhjcqnzgvyb.supabase.co",
  anonKey: "" // Pendiente de incorporar la publishable key de Josh Cloud.
};
