// Registro de fuentes visible para el usuario.

import { avisoDatos, el } from './util.js';

export function vistaFuentes(catalogo, error) {
  const contenedor = el('section', { class: 'vista', 'aria-labelledby': 'titulo-fuentes' });
  contenedor.append(el('h1', { id: 'titulo-fuentes', tabindex: '-1', text: 'Fuentes / Sources' }));
  contenedor.append(el('p', {
    text: 'Cada dato de la aplicación cita una de estas fuentes. Las secundarias solo respaldan datos pendientes de verificación. / Every app datum cites one of these sources. Secondary sources only back pending data.',
  }));
  const aviso = avisoDatos(error);
  if (aviso) contenedor.append(aviso);

  const fuentes = catalogo?.fuentes ?? [];
  if (fuentes.length === 0) {
    contenedor.append(el('p', { text: 'Sin fuentes cargadas. / No sources loaded.' }));
    return contenedor;
  }

  const tabla = el('table', { class: 'tabla' }, [
    el('caption', { text: `Fuentes registradas (${fuentes.length})` }),
    el('thead', {}, [el('tr', {}, [
      el('th', { scope: 'col', text: 'ID' }),
      el('th', { scope: 'col', text: 'Fuente' }),
      el('th', { scope: 'col', text: 'Clase' }),
      el('th', { scope: 'col', text: 'Notas' }),
    ])]),
    el('tbody', {}, fuentes.map((f) => el('tr', {}, [
      el('td', { text: f.id }),
      el('td', {}, [el('a', { href: f.url, rel: 'noopener noreferrer', text: f.nombre })]),
      el('td', { text: f.clase }),
      el('td', { text: f.notas ?? '' }),
    ]))),
  ]);
  contenedor.append(tabla);
  return contenedor;
}
