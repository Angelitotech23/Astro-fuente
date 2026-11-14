// Punto de entrada: navegación por hash y carga inicial del catálogo.
//
// Rutas: #/ · #/sistema-solar · #/historico · #/mision/<id> · #/simulador · #/director · #/fuentes · #/futuro

import { ErrorDatos, cargarCatalogo, catalogoLocal } from './datos/supabase.js';
import { vistaInicio } from './vistas/inicio.js';
import { vistaSistemaSolar } from './vistas/sistema-solar.js';
import { vistaHistorico, vistaMision } from './vistas/misiones.js';
import { vistaFuentes } from './vistas/fuentes.js';
import { vistaFuturo } from './vistas/futuro.js';
import { vistaSimulador } from './simulador/vista.js';
import { vistaDirector } from './director/vista.js';

const app = document.getElementById('app');
const estadoCarga = document.getElementById('estado-carga');

const catalogoPromesa = cargarCatalogo().catch(() => ({
  catalogo: catalogoLocal(),
  error: new ErrorDatos('lectura', 'No se pudo cargar el catálogo.'),
}));

function rutaActual() {
  const partes = (location.hash || '#/').replace(/^#\/?/, '').split('/').filter(Boolean);
  return partes;
}

function resolver(partes) {
  const [raiz, arg] = partes;
  switch (raiz) {
    case undefined: return (c, e) => vistaInicio(c, e);
    case 'sistema-solar': return (c, e) => vistaSistemaSolar(c, e);
    case 'historico': return (c, e) => vistaHistorico(c, e);
    case 'mision': return (c, e) => vistaMision(c, arg, e);
    case 'simulador': return () => vistaSimulador();
    case 'director': return () => vistaDirector();
    case 'fuentes': return (c, e) => vistaFuentes(c, e);
    case 'futuro': return () => vistaFuturo();
    default: return null;
  }
}

async function renderizar() {
  const partes = rutaActual();
  const fabrica = resolver(partes);
  const { catalogo, error } = await catalogoPromesa;
  if (!fabrica) {
    app.replaceChildren(vistaInicio(catalogo, error));
    document.title = 'Astro-fuente';
    marcarEnlaceActivo();
    if (estadoCarga) estadoCarga.hidden = true;
    return;
  }
  app.replaceChildren(fabrica(catalogo, error));
  const titulo = app.querySelector('h1');
  document.title = titulo ? `${titulo.textContent} · Astro-fuente` : 'Astro-fuente';
  if (titulo && typeof titulo.focus === 'function') {
    try {
      titulo.focus({ preventScroll: true });
    } catch {
      /* ignore */
    }
  }
  if (estadoCarga) estadoCarga.hidden = true;
  marcarEnlaceActivo();
}

function marcarEnlaceActivo() {
  const partes = rutaActual();
  const actual = partes.length ? `#/${partes.join('/')}` : '#/';
  document.querySelectorAll('.navegacion a').forEach((a) => {
    const destino = a.getAttribute('href');
    const mismo = destino === actual
      || (actual === '#/' && destino === '#/')
      || (partes[0] === 'mision' && destino === '#/mision/apolo-11' && partes[1]);
    if (mismo) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
}

window.addEventListener('hashchange', () => {
  // Enlaces de ancla como #contenido (skip link) no son rutas: no re-renderizar.
  if (location.hash && !location.hash.startsWith('#/')) return;
  renderizar();
});

marcarEnlaceActivo();
renderizar();
