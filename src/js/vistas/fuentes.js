// Registro de fuentes visible para el usuario, a partir de la tabla `fuentes`.

import { avisoDatos, el } from './util.js';

export function vistaFuentes(catalogo, error) {
  const contenedor = el('section', { class: 'vista', 'aria-labelledby': 'titulo-fuentes' });
  contenedor.append(el('h1', { id: 'titulo-fuentes', tabindex: '-1', text: 'Fuentes' }));
  contenedor.append(el('p', {
    text: 'Cada dato de la aplicación cita una de estas fuentes. Las secundarias solo respaldan datos pendientes de verificación.',
  }));
  const aviso = avisoDatos(error);
  if (aviso) contenedor.append(aviso);

  const tabla = el('table', { class: 'tabla' }, [
    el('caption', { text: 'Fuentes registradas' }),
    el('thead', {}, [el('tr', {}, [
      el('th', { scope: 'col', text: 'Fuente' }),
      el('th', { scope: 'col', text: 'Clase' }),
      el('th', { scope: 'col', text: 'Notas' }),
    ])]),
    el('tbody', {}, catalogo.fuentes.map((f) => el('tr', {}, [
      el('td', {}, [el('a', { href: f.url, rel: 'noopener noreferrer', text: f.nombre })]),
      el('td', { text: f.clase }),
      el('td', { text: f.notas ?? '' }),
    ]))),
  ]);
  if (catalogo.fuentes.length === 0) {
    contenedor.append(el('p', { text: 'Sin fuentes cargadas.' }));
  } else {
    contenedor.append(tabla);
  }
  return contenedor;
}
