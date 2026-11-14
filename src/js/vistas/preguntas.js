// Preguntas curadas con respuestas citadas (módulo G, fase 1).
// Solo se publican respuestas con fuente que tenga URL. Las demás van a docs/decisiones.md.

import { avisoDatos, el } from './util.js';

/**
 * Corpus publicado. Cada entrada exige fuente.url.
 * No incluir afirmaciones respaldadas solo por «literatura estándar».
 */
export const PREGUNTAS_CURADAS = Object.freeze([
  {
    id: 'P-G0',
    pregunta: '¿Cuál es la aceleración estándar de la gravedad (g₀)?',
    respuesta: '9,80665 m/s². Es un valor exacto por definición (CODATA).',
    fuente: {
      id: 'F-NIST-G0',
      nombre: 'NIST CODATA · standard acceleration of gravity',
      url: 'https://physics.nist.gov/cgi-bin/cuu/Value?gn',
    },
    fechaConsulta: '2026-11-14',
    datoId: 'TIERRA-G0',
  },
  {
    id: 'P-TIERRA-RADIO',
    pregunta: '¿Cuál es el radio volumétrico medio de la Tierra?',
    respuesta: '6371,000 km, según la ficha planetaria del NSSDC.',
    fuente: {
      id: 'F-NSSDC-EARTH',
      nombre: 'NASA NSSDC Earth Fact Sheet',
      url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html',
    },
    fechaConsulta: '2026-11-14',
    datoId: 'TIERRA-RADIO-VOL',
  },
  {
    id: 'P-TIERRA-PRESION',
    pregunta: '¿Cuál es la presión atmosférica superficial de la Tierra en la ficha NSSDC?',
    respuesta: '1014 mb (hectopascales equivalentes en la misma ficha).',
    fuente: {
      id: 'F-NSSDC-EARTH',
      nombre: 'NASA NSSDC Earth Fact Sheet',
      url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html',
    },
    fechaConsulta: '2026-11-14',
    datoId: 'TIERRA-ATM-PRESION',
  },
  {
    id: 'P-LUNA-G',
    pregunta: '¿Cuál es la gravedad superficial de la Luna?',
    respuesta: '1,62 m/s², según la ficha lunar del NSSDC.',
    fuente: {
      id: 'F-NSSDC-MOON',
      nombre: 'NASA NSSDC Moon Fact Sheet',
      url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html',
    },
    fechaConsulta: '2026-11-14',
    datoId: 'LUNA-G-SUPERFICIE',
  },
  {
    id: 'P-LUNA-PESO',
    pregunta: '¿Cuánto pesaría una masa de 80 kg en la superficie lunar?',
    respuesta: '129,6 N. Se calcula como P = m · g = 80 × 1,62, con g lunar de la ficha NSSDC.',
    fuente: {
      id: 'F-NSSDC-MOON',
      nombre: 'NASA NSSDC Moon Fact Sheet',
      url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html',
    },
    fechaConsulta: '2026-11-14',
    datoId: 'LUNA-PESO-REF-80KG',
  },
  {
    id: 'P-TIERRA-N2',
    pregunta: '¿Qué fracción del aire seco es nitrógeno según la ficha NSSDC de la Tierra?',
    respuesta: '78,08 % en volumen (aire seco).',
    fuente: {
      id: 'F-NSSDC-EARTH',
      nombre: 'NASA NSSDC Earth Fact Sheet',
      url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html',
    },
    fechaConsulta: '2026-11-14',
    datoId: 'TIERRA-ATM-N2',
  },
]);

function tarjetaPregunta(p) {
  return el('article', { class: 'pregunta', 'aria-labelledby': `preg-${p.id}` }, [
    el('h2', { id: `preg-${p.id}`, text: p.pregunta }),
    el('p', { class: 'pregunta__respuesta', text: p.respuesta }),
    el('dl', { class: 'pregunta__meta' }, [
      el('dt', { text: 'Fuente' }),
      el('dd', {}, [
        el('a', { href: p.fuente.url, rel: 'noopener noreferrer', text: `${p.fuente.nombre} (${p.fuente.id})` }),
      ]),
      el('dt', { text: 'Fecha de consulta' }),
      el('dd', {}, [el('time', { datetime: p.fechaConsulta, text: p.fechaConsulta })]),
      el('dt', { text: 'Dato relacionado' }),
      el('dd', { text: p.datoId }),
    ]),
  ]);
}

export function vistaPreguntas(catalogo, error) {
  const contenedor = el('section', { class: 'vista', 'aria-labelledby': 'titulo-preguntas' });
  contenedor.append(el('h1', { id: 'titulo-preguntas', tabindex: '-1', text: 'Preguntas curadas' }));
  contenedor.append(el('p', {
    text: 'Respuestas breves con fuente URL y fecha de consulta. No se publican afirmaciones respaldadas solo por «literatura estándar».',
  }));
  const aviso = avisoDatos(error);
  if (aviso) contenedor.append(aviso);

  const publicadas = PREGUNTAS_CURADAS.filter((p) => p.fuente?.url);
  contenedor.append(el('div', { class: 'preguntas' }, publicadas.map(tarjetaPregunta)));
  contenedor.append(el('p', {
    class: 'nota',
    text: 'Las preguntas pendientes (sin URL de fuente) están listadas en docs/decisiones.md.',
  }));
  return contenedor;
}
