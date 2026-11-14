// Visor del sistema solar en 2D, navegable con teclado.
//
// Esquema ilustrativo: las órbitas no están a escala. Ninguna magnitud se muestra
// como cifra; cada una pasa por el componente `dato` y aparece como pendiente
// hasta verificarse.

import { renderDato, vistaDato } from '../componentes/dato.js';
import { avisoDatos, el, svg } from './util.js';

const CUERPOS = [
  { slug: 'MERCURIO', nombre: 'Mercurio' },
  { slug: 'VENUS', nombre: 'Venus' },
  { slug: 'TIERRA', nombre: 'Tierra' },
  { slug: 'MARTE', nombre: 'Marte' },
  { slug: 'JUPITER', nombre: 'Júpiter' },
  { slug: 'SATURNO', nombre: 'Saturno' },
  { slug: 'URANO', nombre: 'Urano' },
  { slug: 'NEPTUNO', nombre: 'Neptuno' },
];

const MAGNITUDES = [
  { sufijo: 'RADIO' },
  { sufijo: 'DIST' },
  { sufijo: 'PERIODO' },
];

function datosDeCuerpo(catalogo, slug) {
  return MAGNITUDES.map(({ sufijo }) => catalogo.datos.find((d) => d.id === `SS-${slug}-${sufijo}`))
    .filter(Boolean);
}

function dibujarEsquema(seleccionado, onSelect) {
  const tamano = 320;
  const centro = tamano / 2;
  const radioMax = 140;
  const grupo = svg('svg', {
    viewBox: `0 0 ${tamano} ${tamano}`,
    class: 'sistema__esquema',
    role: 'img',
    'aria-label': 'Esquema del sistema solar. Órbitas ilustrativas, no a escala.',
  });
  grupo.append(svg('circle', { cx: centro, cy: centro, r: 14, class: 'sistema__sol' }));
  CUERPOS.forEach((c, i) => {
    const r = 30 + ((radioMax - 30) * (i + 1)) / CUERPOS.length;
    grupo.append(svg('circle', { cx: centro, cy: centro, r, class: 'sistema__orbita' }));
    const angulo = (i * 47 * Math.PI) / 180;
    const x = centro + r * Math.cos(angulo);
    const y = centro + r * Math.sin(angulo);
    const marca = svg('circle', {
      cx: x, cy: y, r: i === seleccionado ? 7 : 5,
      class: i === seleccionado ? 'sistema__cuerpo sistema__cuerpo--activo' : 'sistema__cuerpo',
      'data-indice': i,
    });
    marca.addEventListener('click', () => onSelect(i));
    grupo.append(marca);
  });
  return grupo;
}

export function vistaSistemaSolar(catalogo, error) {
  const contenedor = el('section', { class: 'vista', 'aria-labelledby': 'titulo-sistema' });
  contenedor.append(el('h1', { id: 'titulo-sistema', tabindex: '-1', text: 'Sistema solar' }));
  contenedor.append(el('p', {
    text: 'Esquema ilustrativo: las órbitas no están a escala. Usa las flechas del teclado o la lista para elegir un cuerpo.',
  }));
  contenedor.append(el('p', {}, [
    'Fichas detalladas de Tierra y Luna: ',
    el('a', { href: '#/observatorio', text: 'Observatorio' }),
    '.',
  ]));
  const aviso = avisoDatos(error);
  if (aviso) contenedor.append(aviso);

  const lista = el('ul', { class: 'sistema__lista', 'aria-label': 'Cuerpos del sistema solar' });
  const detalle = el('div', { class: 'sistema__detalle', 'aria-live': 'polite' });
  let seleccionado = 2;

  function seleccionar(indice) {
    seleccionado = (indice + CUERPOS.length) % CUERPOS.length;
    actualizar();
    const boton = lista.querySelectorAll('button')[seleccionado];
    if (boton) boton.focus();
  }

  function actualizar() {
    const cuerpo = CUERPOS[seleccionado];
    lista.querySelectorAll('button').forEach((b, i) => {
      b.setAttribute('aria-pressed', String(i === seleccionado));
      b.tabIndex = i === seleccionado ? 0 : -1;
    });
    detalle.replaceChildren(el('h2', { text: cuerpo.nombre }));
    const datos = datosDeCuerpo(catalogo, cuerpo.slug);
    if (datos.length === 0) {
      detalle.append(el('p', { text: 'Sin datos cargados para este cuerpo.' }));
    }
    for (const d of datos) {
      detalle.append(renderDato(vistaDato(d, catalogo.fuentes, new Date())));
    }
    const esquema = contenedor.querySelector('.sistema__esquema');
    if (esquema) esquema.replaceWith(dibujarEsquema(seleccionado, seleccionar));
  }

  CUERPOS.forEach((c, i) => {
    const boton = el('button', {
      type: 'button',
      class: 'sistema__boton',
      onclick: () => seleccionar(i),
      onkeydown: (e) => {
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); seleccionar(i + 1); }
        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); seleccionar(i - 1); }
        if (e.key === 'Home') { e.preventDefault(); seleccionar(0); }
        if (e.key === 'End') { e.preventDefault(); seleccionar(CUERPOS.length - 1); }
      },
      text: c.nombre,
    });
    lista.append(el('li', {}, [boton]));
  });

  contenedor.append(
    el('div', { class: 'sistema__cuerpo-wrap' }, [lista, dibujarEsquema(seleccionado, seleccionar)]),
    detalle,
  );
  actualizar();
  return contenedor;
}
