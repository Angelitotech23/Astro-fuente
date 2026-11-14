// Punto de entrada: navegación por hash y carga inicial del catálogo.
//
// Rutas: #/ · #/sistema-solar · #/historico · #/mision/<id> · #/simulador · #/fuentes

import { cargarCatalogo } from './datos/supabase.js';
import { vistaInicio } from './vistas/inicio.js';
import { vistaSistemaSolar } from './vistas/sistema-solar.js';
import { vistaHistorico, vistaMision } from './vistas/misiones.js';
import { vistaFuentes } from './vistas/fuentes.js';
import { vistaSimulador } from './simulador/vista.js';

const VACIO = { fuentes: [], misiones: [], datos: [], eventos: [] };

const app = document.getElementById('app');
const estadoCarga = document.getElementById('estado-carga');

const catalogoPromesa = cargarCatalogo().then(
  (catalogo) => ({ catalogo, error: null }),
  (error) => ({ catalogo: VACIO, error }),
);

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
    case 'fuentes': return (c, e) => vistaFuentes(c, e);
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
    return;
  }
  app.replaceChildren(fabrica(catalogo, error));
  const titulo = app.querySelector('h1');
  document.title = titulo ? `${titulo.textContent} · Astro-fuente` : 'Astro-fuente';
  if (titulo) titulo.focus({ preventScroll: false });
  if (estadoCarga) estadoCarga.hidden = true;
}

function marcarEnlaceActivo() {
  const actual = `#/${rutaActual().join('/')}`;
  document.querySelectorAll('.navegacion a').forEach((a) => {
    const destino = a.getAttribute('href');
    if (destino === actual || (actual === '#/' && destino === '#/')) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
}

window.addEventListener('hashchange', () => {
  marcarEnlaceActivo();
  renderizar();
});

marcarEnlaceActivo();
renderizar();
