// Acceso de solo lectura a Supabase, con catálogo local de respaldo.
//
// supabase-js se carga desde cdn.jsdelivr.net con versión exacta (dos semanas
// o más de antigüedad). El cliente usa la clave publicable de src/js/config.js.

import { CONFIG } from '../config.js';
import { FUENTES_LOCALES } from './fuentes-locales.js';

export const VERSION_SUPABASE_JS = '2.45.4';
const URL_SDK = `https://cdn.jsdelivr.net/npm/@supabase/supabase-js@${VERSION_SUPABASE_JS}/+esm`;

export class ErrorDatos extends Error {
  constructor(codigo, mensaje) {
    super(mensaje);
    this.name = 'ErrorDatos';
    this.codigo = codigo;
  }
}

export function hayConfiguracion() {
  return Boolean(CONFIG.supabaseUrl && CONFIG.supabasePublishableKey);
}

/** Catálogo mínimo usable sin backend (fuentes locales; resto vacío). */
export function catalogoLocal() {
  return {
    fuentes: FUENTES_LOCALES.map((f) => ({ ...f })),
    misiones: [],
    datos: [],
    eventos: [],
  };
}

let clientePromesa = null;

function obtenerCliente() {
  if (!hayConfiguracion()) {
    throw new ErrorDatos('sin_configuracion', 'Falta la URL y la clave publicable en src/js/config.js.');
  }
  if (!clientePromesa) {
    clientePromesa = import(URL_SDK).then(({ createClient }) =>
      createClient(CONFIG.supabaseUrl, CONFIG.supabasePublishableKey, {
        auth: { persistSession: false },
      }),
    );
  }
  return clientePromesa;
}

async function leerTabla(tabla, columnaOrden) {
  const cliente = await obtenerCliente();
  const { data, error } = await cliente
    .from(tabla)
    .select('*')
    .order(columnaOrden, { ascending: true });
  if (error) throw new ErrorDatos('lectura', `No se pudo leer ${tabla}: ${error.message}`);
  return data ?? [];
}

/**
 * Carga el catálogo completo.
 * Sin configuración: devuelve fuentes locales y marca error `sin_configuracion`
 * para que la UI muestre el aviso, sin dejar #/fuentes vacío.
 */
export async function cargarCatalogo() {
  if (!hayConfiguracion()) {
    const error = new ErrorDatos(
      'sin_configuracion',
      'Falta la URL y la clave publicable en src/js/config.js.',
    );
    return { catalogo: catalogoLocal(), error };
  }
  try {
    const [fuentes, misiones, datos, eventos] = await Promise.all([
      leerTabla('fuentes', 'id'),
      leerTabla('misiones', 'orden'),
      leerTabla('datos', 'id'),
      leerTabla('eventos', 'orden'),
    ]);
    return { catalogo: { fuentes, misiones, datos, eventos }, error: null };
  } catch (error) {
    return { catalogo: catalogoLocal(), error };
  }
}
