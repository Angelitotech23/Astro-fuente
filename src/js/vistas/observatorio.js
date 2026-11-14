// Observatorio (fase 1): fichas de Tierra (módulo A) y Luna (módulo C).
// Cada magnitud pasa por el componente `dato`. Sin fuente primaria, sin cifra.

import { renderDato, vistaDato } from '../componentes/dato.js';
import { DATOS_LOCALES, INVENTARIO_LUNAR } from '../datos/semilla-local.js';
import { avisoDatos, el } from './util.js';

const FICHAS = {
  tierra: {
    titulo: 'Tierra',
    intro: 'Estructura interna, atmósfera y campo magnético. Valores con unidad y fuente.',
    secciones: [
      {
        titulo: 'Estructura interna',
        ids: ['TIERRA-RADIO-VOL', 'TIERRA-NUCLEO-RADIO', 'TIERRA-MANTO-ESPESOR', 'TIERRA-CORTEZA-ESPESOR'],
      },
      {
        titulo: 'Atmósfera',
        ids: ['TIERRA-ATM-PRESION', 'TIERRA-ATM-ESCALA', 'TIERRA-ATM-N2', 'TIERRA-ATM-O2'],
      },
      {
        titulo: 'Campo magnético y gravedad',
        ids: ['TIERRA-MAG-DIPOLO', 'TIERRA-MAG-SUPERFICIE', 'TIERRA-G-MEDIA', 'TIERRA-G0'],
      },
    ],
  },
  luna: {
    titulo: 'Luna',
    intro: 'Ficha lunar, peso de referencia en superficie e inventario de misiones.',
    secciones: [
      {
        titulo: 'Datos de referencia',
        ids: ['LUNA-RADIO-VOL', 'LUNA-G-SUPERFICIE', 'LUNA-DIST-SEMIEJE', 'LUNA-PESO-REF-80KG'],
      },
    ],
  },
};

const ORDEN = ['tierra', 'luna'];

function resolverDato(catalogo, id) {
  return catalogo.datos.find((d) => d.id === id)
    ?? DATOS_LOCALES.find((d) => d.id === id)
    ?? null;
}

function renderSeccion(catalogo, seccion) {
  const bloque = el('section', { class: 'observatorio__seccion' });
  bloque.append(el('h3', { text: seccion.titulo }));
  for (const id of seccion.ids) {
    const dato = resolverDato(catalogo, id);
    if (!dato) {
      bloque.append(el('p', { class: 'aviso', text: `Falta el dato ${id} en el catálogo.` }));
      continue;
    }
    bloque.append(renderDato(vistaDato(dato, catalogo.fuentes, new Date())));
  }
  return bloque;
}

function renderInventarioLunar() {
  const bloque = el('section', { class: 'observatorio__seccion' });
  bloque.append(el('h3', { text: 'Inventario de misiones lunares' }));
  bloque.append(el('p', { text: INVENTARIO_LUNAR.definicionAlunizaje }));
  bloque.append(el('h4', { text: 'Tripuladas (candidatas a alunizaje)' }));
  bloque.append(el('ul', { class: 'observatorio__lista' }, INVENTARIO_LUNAR.tripuladas.map((m) => el('li', {}, [
    el('strong', { text: m.nombre }),
    ` — estado del dato: ${m.estado} (sin fuente primaria leída; sin cifra de fecha ni resultado).`,
  ]))));
  bloque.append(el('h4', { text: 'Robóticas' }));
  bloque.append(el('p', { class: 'aviso', text: INVENTARIO_LUNAR.roboticasNota }));
  return bloque;
}

function panelFicha(catalogo, clave) {
  const ficha = FICHAS[clave];
  const panel = el('div', {
    class: 'observatorio__panel',
    role: 'tabpanel',
    id: `panel-${clave}`,
    'aria-labelledby': `tab-${clave}`,
  });
  panel.append(el('h2', { text: ficha.titulo }));
  panel.append(el('p', { text: ficha.intro }));
  for (const seccion of ficha.secciones) {
    panel.append(renderSeccion(catalogo, seccion));
  }
  if (clave === 'luna') panel.append(renderInventarioLunar());
  return panel;
}

export function vistaObservatorio(catalogo, error) {
  const contenedor = el('section', { class: 'vista', 'aria-labelledby': 'titulo-observatorio' });
  contenedor.append(el('h1', { id: 'titulo-observatorio', tabindex: '-1', text: 'Observatorio' }));
  contenedor.append(el('p', {
    text: 'Fichas de Tierra y Luna (fase 1). Cada valor muestra fuente, fecha de consulta y estado. Proyecto independiente, sin respaldo de la NASA.',
  }));
  const aviso = avisoDatos(error);
  if (aviso) contenedor.append(aviso);

  let activa = 'tierra';
  const pestanas = el('div', { class: 'observatorio__tabs', role: 'tablist', 'aria-label': 'Fichas del Observatorio' });
  const contenido = el('div', { class: 'observatorio__contenido' });

  function mostrar(clave) {
    activa = clave;
    pestanas.querySelectorAll('[role="tab"]').forEach((tab) => {
      const sel = tab.dataset.ficha === clave;
      tab.setAttribute('aria-selected', String(sel));
      tab.tabIndex = sel ? 0 : -1;
    });
    contenido.replaceChildren(panelFicha(catalogo, clave));
  }

  ORDEN.forEach((clave, indice) => {
    const tab = el('button', {
      type: 'button',
      role: 'tab',
      id: `tab-${clave}`,
      class: 'observatorio__tab',
      'aria-controls': `panel-${clave}`,
      'data-ficha': clave,
      text: FICHAS[clave].titulo,
      onclick: () => mostrar(clave),
      onkeydown: (e) => {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft' && e.key !== 'Home' && e.key !== 'End') return;
        e.preventDefault();
        let siguiente = indice;
        if (e.key === 'ArrowRight') siguiente = (indice + 1) % ORDEN.length;
        if (e.key === 'ArrowLeft') siguiente = (indice - 1 + ORDEN.length) % ORDEN.length;
        if (e.key === 'Home') siguiente = 0;
        if (e.key === 'End') siguiente = ORDEN.length - 1;
        mostrar(ORDEN[siguiente]);
        pestanas.querySelector(`[data-ficha="${ORDEN[siguiente]}"]`)?.focus();
      },
    });
    pestanas.append(tab);
  });

  contenedor.append(pestanas, contenido);
  mostrar('tierra');
  return contenedor;
}
