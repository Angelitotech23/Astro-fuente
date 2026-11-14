// Histórico (Apolo 1 a 17 como identificadores) y detalle de misión.
//
// Sin verificar no hay cifras: las fechas se muestran como pendientes mediante el
// componente `dato`. La trayectoria es un esquema etiquetado "sin cifras".

import { renderDato, vistaDato } from '../componentes/dato.js';
import { avisoDatos, el, svg } from './util.js';

const TEXTO_PENDIENTE_PORQUE =
  'Pendiente de verificación. Esta explicación se redactará con fuentes primarias (F-NASA-HO) antes de publicarse.';

const NOMBRES_ESPECIALES = { 'artemis-ii': 'Artemis II' };

function nombreDesdeId(id) {
  if (NOMBRES_ESPECIALES[id]) return NOMBRES_ESPECIALES[id];
  return String(id ?? '')
    .split('-')
    .map((p) => (p.length ? p[0].toUpperCase() + p.slice(1) : p))
    .join(' ');
}

function ordenar(misiones) {
  return [...misiones].sort((a, b) => a.orden - b.orden);
}

export function vistaHistorico(catalogo, error) {
  const contenedor = el('section', { class: 'vista', 'aria-labelledby': 'titulo-historico' });
  contenedor.append(el('h1', { id: 'titulo-historico', tabindex: '-1', text: 'Histórico de misiones' }));
  contenedor.append(el('p', {
    text: 'Línea de tiempo del programa Apolo y de Artemis II. Las fechas se muestran como pendientes hasta verificarlas en fuentes primarias.',
  }));
  const aviso = avisoDatos(error);
  if (aviso) contenedor.append(aviso);

  if (catalogo.misiones.length === 0) {
    contenedor.append(el('p', { text: 'Sin misiones cargadas.' }));
  }
  const lista = el('ol', { class: 'linea-tiempo' });
  for (const m of ordenar(catalogo.misiones)) {
    const idDato = m.id === 'artemis-ii' ? 'ARTEMIS-II-LANZ' : `${m.id.toUpperCase()}-LANZ`;
    const dato = catalogo.datos.find((d) => d.id === idDato);
    const enlaceDetalle = m.id === 'apolo-11' || m.id === 'artemis-ii'
      ? el('a', { href: `#/mision/${m.id}`, text: `Ver trayectoria de ${m.nombre}` })
      : null;
    lista.append(el('li', { class: 'linea-tiempo__item' }, [
      el('h2', { class: 'linea-tiempo__titulo', text: m.nombre }),
      dato ? renderDato(vistaDato(dato, catalogo.fuentes, new Date())) : el('p', { text: 'Sin datos cargados.' }),
      enlaceDetalle,
    ]));
  }
  contenedor.append(lista);
  contenedor.append(el('p', {
    class: 'nota',
    text: 'Apolo 2 y Apolo 3 no tuvieron misión, según docs/fuentes.md, y no aparecen en la línea de tiempo.',
  }));
  return contenedor;
}

// Trayectoria esquemática Tierra–Luna–Tierra. No está a escala.
const RUTA_IDA_VUELTA = 'M60,150 C120,20 260,20 340,150 C260,280 120,280 60,150';

function dibujarTrayectoria(eventos) {
  const tamano = { w: 400, h: 300 };
  const grafico = svg('svg', {
    viewBox: `0 0 ${tamano.w} ${tamano.h}`,
    class: 'trayectoria',
    role: 'img',
    'aria-label': 'Trayectoria ilustrativa, sin cifras. No está a escala.',
  });
  grafico.append(svg('circle', { cx: 60, cy: 150, r: 22, class: 'trayectoria__tierra' }));
  grafico.append(svg('text', { x: 60, y: 200, class: 'trayectoria__etiqueta', 'text-anchor': 'middle' }, ['Tierra']));
  grafico.append(svg('circle', { cx: 340, cy: 150, r: 14, class: 'trayectoria__luna' }));
  grafico.append(svg('text', { x: 340, y: 200, class: 'trayectoria__etiqueta', 'text-anchor': 'middle' }, ['Luna']));
  const ruta = svg('path', { d: RUTA_IDA_VUELTA, class: 'trayectoria__ruta', fill: 'none' });
  grafico.append(ruta);
  grafico.append(svg('text', { x: 200, y: 30, class: 'trayectoria__leyenda', 'text-anchor': 'middle' },
    ['Esquema ilustrativo, sin cifras']));

  const longitud = ruta.getTotalLength ? ruta.getTotalLength() : 0;
  const n = eventos.length;
  eventos.forEach((ev, i) => {
    const fraccion = n <= 1 ? 0 : i / (n - 1);
    const punto = ruta.getPointAtLength ? ruta.getPointAtLength(fraccion * longitud) : { x: 60, y: 150 };
    grafico.append(svg('circle', { cx: punto.x, cy: punto.y, r: 6, class: 'trayectoria__evento' }));
    grafico.append(svg('text', { x: punto.x, y: punto.y - 10, class: 'trayectoria__numero', 'text-anchor': 'middle' },
      [String(i + 1)]));
  });
  return grafico;
}

export function vistaMision(catalogo, id, error) {
  const mision = catalogo.misiones.find((m) => m.id === id);
  const contenedor = el('section', { class: 'vista', 'aria-labelledby': 'titulo-mision' });
  if (!mision && error) {
    // Sin datos cargados no sabemos si la misión existe: no la damos por inexistente.
    contenedor.append(el('h1', { id: 'titulo-mision', tabindex: '-1', text: nombreDesdeId(id) }));
    contenedor.append(avisoDatos(error));
    contenedor.append(el('p', { text: 'La trayectoria y los eventos aparecerán cuando haya datos cargados.' }));
    contenedor.append(el('a', { href: '#/historico', text: 'Volver al histórico' }));
    return contenedor;
  }
  if (!mision) {
    contenedor.append(el('h1', { id: 'titulo-mision', tabindex: '-1', text: 'Misión no encontrada' }));
    contenedor.append(el('p', { text: 'Vuelve al histórico para elegir una misión.' }));
    contenedor.append(el('a', { href: '#/historico', text: 'Ir al histórico' }));
    return contenedor;
  }
  contenedor.append(el('h1', { id: 'titulo-mision', tabindex: '-1', text: mision.nombre }));
  const aviso = avisoDatos(error);
  if (aviso) contenedor.append(aviso);

  const eventos = catalogo.eventos
    .filter((e) => e.mision_id === mision.id)
    .sort((a, b) => a.orden - b.orden);

  contenedor.append(el('h2', { text: 'Trayectoria' }));
  contenedor.append(dibujarTrayectoria(eventos.length ? eventos : [{ nombre: 'Sin eventos cargados' }]));

  contenedor.append(el('h2', { text: 'Por qué se hizo y qué aportó' }));
  contenedor.append(el('p', { class: 'aviso', text: TEXTO_PENDIENTE_PORQUE }));

  contenedor.append(el('h2', { text: 'Eventos clave' }));
  const lista = el('ol', { class: 'eventos' });
  for (const ev of eventos) {
    lista.append(el('li', { class: 'eventos__item' }, [
      el('h3', { text: ev.nombre }),
      el('p', { text: ev.explicacion }),
    ]));
  }
  if (!eventos.length) lista.append(el('li', { text: 'Sin eventos cargados.' }));
  contenedor.append(lista);

  const idsDatos = mision.id === 'artemis-ii'
    ? ['ARTEMIS-II-LANZ', 'ARTEMIS-II-AMERIZAJE']
    : [`${mision.id.toUpperCase()}-LANZ`];
  const datosMision = idsDatos
    .map((id) => catalogo.datos.find((d) => d.id === id))
    .filter(Boolean);
  if (datosMision.length) {
    contenedor.append(el('h2', { text: 'Datos' }));
    for (const d of datosMision) contenedor.append(renderDato(vistaDato(d, catalogo.fuentes, new Date())));
  }
  contenedor.append(el('p', { class: 'nota', text: 'Esquema ilustrativo: no representa distancias, tiempos ni órbitas reales.' }));
  contenedor.append(el('a', { href: '#/historico', text: 'Volver al histórico' }));
  return contenedor;
}
