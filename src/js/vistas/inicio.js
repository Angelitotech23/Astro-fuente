// Página de inicio: qué es el proyecto y en qué estado está cada parte.

import { avisoDatos, el } from './util.js';

const MODULOS = [
  { nombre: 'Sistema solar', estado: 'En esta versión, con datos pendientes de verificación', ruta: '#/sistema-solar' },
  { nombre: 'Histórico Apolo y Artemis II', estado: 'Línea de tiempo con fechas pendientes', ruta: '#/historico' },
  { nombre: 'Trayectorias de Apolo 11 y Artemis II', estado: 'Esquema ilustrativo, sin cifras', ruta: '#/mision/apolo-11' },
  { nombre: 'Simulador de vuelo', estado: 'Modelo simplificado de una fase', ruta: '#/simulador' },
  { nombre: 'Fuentes', estado: 'Registro legible de cada fuente', ruta: '#/fuentes' },
];

export function vistaInicio(catalogo, error) {
  const contenedor = el('section', { class: 'vista', 'aria-labelledby': 'titulo-inicio' });
  contenedor.append(el('h1', { id: 'titulo-inicio', tabindex: '-1', text: 'Astro-fuente' }));
  contenedor.append(el('p', {
    class: 'lead',
    text: 'Simulador web de exploración espacial verificable: cada dato muestra su fuente, su fecha de consulta y su estado.',
  }));
  const aviso = avisoDatos(error);
  if (aviso) contenedor.append(aviso);

  contenedor.append(el('ul', { class: 'modulos' }, MODULOS.map((m) => el('li', { class: 'modulos__item' }, [
    el('a', { href: m.ruta, text: m.nombre }),
    el('span', { class: 'modulos__estado', text: ` — ${m.estado}` }),
  ]))));

  contenedor.append(el('p', {
    class: 'nota',
    text: 'Proyecto independiente, sin afiliación con la NASA ni con otras agencias o empresas mencionadas. Desarrollado para el NASA Art Space Challenge.',
  }));
  return contenedor;
}
