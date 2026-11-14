// Panel de programas futuros (Artemis III, IV y V).
//
// Cada fila lleva estado, fecha de corte y las fuentes que la respaldan. Las fechas
// no son datos verificados: se atribuyen a cada fuente y, cuando las fuentes
// discrepan, se muestran todas. Nada se presenta como cifra oficial.

import { el } from './util.js';

export const FECHA_DE_CORTE = '2026-11-14';

const PROGRAMAS = [
  {
    id: 'artemis-iii',
    nombre: 'Artemis III',
    estado: 'Planificado',
    fechas: [
      { fuente: 'NASA', fecha: 'Mediados de 2027', url: 'https://www.nasa.gov/missions/artemis/nasas-artemis-iii-mission-to-test-future-moon-lander-operations/' },
      { fuente: 'Space.com', fecha: 'Tercer trimestre de 2027', url: 'https://www.space.com/space-exploration/artemis/when-will-spacex-and-blue-origin-fly-to-the-moon-nasa-reveals-lunar-lander-timelines-and-an-artemis-iii-update' },
    ],
    descripcion: 'Prueba tripulada en órbita terrestre baja, con landers de prueba de Blue Origin y SpaceX. Vehículos previstos: SLS y Orion.',
    nota: 'Las fuentes dan fechas distintas. No hay fecha confirmada por la agencia.',
  },
  {
    id: 'artemis-iv',
    nombre: 'Artemis IV',
    estado: 'Planificado',
    fechas: [
      { fuente: 'Objetivo vigente', fecha: '2028', url: 'https://spacepolicyonline.com/news/nasa-is-full-steam-ahead-on-artemis-iii-iv-and-v/' },
    ],
    descripcion: 'Primer alunizaje tripulado del programa. Previsto con SLS, Orion y sistema de aterrizaje humano (Starship y Blue Moon).',
    nota: 'Tripulación no disponible en las fuentes consultadas.',
  },
  {
    id: 'artemis-v',
    nombre: 'Artemis V',
    estado: 'Planificado',
    fechas: [
      { fuente: 'Objetivo vigente', fecha: 'Finales de 2028', url: 'https://spacepolicyonline.com/news/nasa-is-full-steam-ahead-on-artemis-iii-iv-and-v/' },
    ],
    descripcion: 'Misión lunar con SLS y Orion. Según fuentes secundarias, el Centaur V de ULA está seleccionado para Artemis IV y V.',
    nota: 'Tripulación no disponible en las fuentes consultadas. Dato secundario: verificar.',
  },
];

function bloquePrograma(p) {
  return el('article', { class: 'futuro__programa', 'aria-labelledby': `futuro-${p.id}` }, [
    el('h2', { id: `futuro-${p.id}`, text: p.nombre }),
    el('p', { class: 'futuro__estado', text: `Estado: ${p.estado} · fecha de corte ${FECHA_DE_CORTE}` }),
    el('p', { text: p.descripcion }),
    el('h3', { text: 'Fecha objetivo según cada fuente' }),
    el('ul', {}, p.fechas.map((f) => el('li', {}, [
      `${f.fecha} — `,
      el('a', { href: f.url, rel: 'noopener noreferrer', text: f.fuente }),
    ]))),
    el('p', { class: 'nota', text: p.nota }),
  ]);
}

export function vistaFuturo() {
  const contenedor = el('section', { class: 'vista', 'aria-labelledby': 'titulo-futuro' });
  contenedor.append(el('h1', { id: 'titulo-futuro', tabindex: '-1', text: 'Programas futuros' }));
  contenedor.append(el('p', {
    text: `Hitos planificados de Artemis, con estado y fecha de corte. Fecha de corte: ${FECHA_DE_CORTE}. Los planes pueden cambiar sin aviso.`,
  }));
  contenedor.append(el('div', { class: 'futuro' }, PROGRAMAS.map(bloquePrograma)));
  contenedor.append(el('p', {
    class: 'nota',
    text: 'Artemis II ya voló: su información está en Trayectorias e Histórico.',
  }));
  return contenedor;
}
