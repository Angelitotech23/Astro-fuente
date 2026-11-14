// Configuración pública del cliente.
//
// Ambos valores son públicos por diseño: la clave publicable solo permite lectura,
// porque las políticas RLS de la base impiden escribir desde el navegador.
//
// NUNCA pongas aquí la clave `service_role` ni ningún secreto.
//
// Estado: el proyecto de Supabase aún no está creado (pendiente de confirmación).
// Hasta entonces la aplicación funciona y muestra los datos como "sin cargar".
export const CONFIG = Object.freeze({
  supabaseUrl: '',
  supabasePublishableKey: '',
});
