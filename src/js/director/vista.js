// Interfaz del Director de misión: trade-offs visibles y debrief causal.

import {
  BUSES,
  FUENTES_DIRECTOR,
  INSTRUMENTOS,
  LANZADORES,
  OBJETIVOS,
  ORBITAS,
  periodoOrbitalHoras,
} from './catalogo.js';
import { MAX_INSTRUMENTOS, evaluarMision } from './evaluar.js';
import { el } from '../vistas/util.js';

const SUPUESTOS = [
  'Modelo didáctico de una sola misión. No es un planificador operativo.',
  'Masas, potencias, costos y tasas de datos son estimaciones educativas (fuente F-AF-DIR).',
  'Los periodos orbitales lunares/LEO se calculan con Kepler; Horizons es la referencia metodológica.',
  'El enlace efectivo = antena del bus × factor de la órbita (visibilidad simplificada).',
  'Éxito exige destino, masa, potencia, datos, presupuesto, duración y ciencia compatibles.',
];

function badgeEstado(estado) {
  const mapa = {
    estimado: 'Estimado',
    calculado: 'Calculado',
    pendiente: 'Pendiente',
    verificado: 'Verificado',
  };
  return mapa[estado] ?? estado;
}

function fichaMagnitud(item, campos) {
  const fuente = FUENTES_DIRECTOR.find((f) => f.id === item.fuenteId);
  const lista = el('dl', { class: 'ficha__campos' });
  for (const [termino, valor] of campos) {
    lista.append(el('dt', { text: termino }), el('dd', { text: String(valor) }));
  }
  lista.append(el('dt', { text: 'Estado' }), el('dd', { text: badgeEstado(item.estado) }));
  if (fuente) {
    const enlace = el('a', {
      href: fuente.url,
      rel: 'noopener noreferrer',
      text: `${fuente.nombre} (${fuente.id})`,
    });
    const dd = el('dd');
    dd.append(enlace);
    lista.append(el('dt', { text: 'Fuente' }), dd);
  }
  lista.append(
    el('dt', { text: 'Fecha de consulta' }),
    el('dd', {}, [el('time', { datetime: item.fechaConsulta, text: item.fechaConsulta })]),
  );
  if (item.supuestos) {
    lista.append(el('dt', { text: 'Supuestos' }), el('dd', { text: item.supuestos }));
  }
  return lista;
}

function opcionRadio({ name, value, checked, titulo, descripcion, onChange }) {
  const id = `${name}-${value}`;
  const label = el('label', { class: 'opcion', for: id });
  const input = el('input', {
    type: 'radio',
    name,
    id,
    value,
    checked: checked || undefined,
    onchange: onChange,
  });
  label.append(input, el('span', { class: 'opcion__titulo', text: titulo }));
  if (descripcion) label.append(el('span', { class: 'opcion__desc', text: descripcion }));
  return label;
}

function opcionCheck({ name, value, checked, disabled, titulo, descripcion, onChange }) {
  const id = `${name}-${value}`;
  const label = el('label', {
    class: `opcion${disabled ? ' opcion--deshabilitada' : ''}`,
    for: id,
  });
  const input = el('input', {
    type: 'checkbox',
    name,
    id,
    value,
    checked: checked || undefined,
    disabled: disabled || undefined,
    onchange: onChange,
  });
  label.append(input, el('span', { class: 'opcion__titulo', text: titulo }));
  if (descripcion) label.append(el('span', { class: 'opcion__desc', text: descripcion }));
  return label;
}

function barraUso(usado, total, etiqueta) {
  const pct = total <= 0 ? 0 : Math.min(100, Math.round((usado / total) * 100));
  const overflow = usado > total;
  const wrap = el('div', { class: 'uso' });
  wrap.append(el('div', { class: 'uso__etiqueta', text: `${etiqueta}: ${fmt(usado)} / ${fmt(total)} (${pct}%)` }));
  const pista = el('div', {
    class: `uso__pista${overflow ? ' uso__pista--overflow' : ''}`,
    role: 'meter',
    'aria-valuemin': '0',
    'aria-valuemax': String(total),
    'aria-valuenow': String(usado),
    'aria-label': etiqueta,
  });
  pista.append(el('div', {
    class: 'uso__lleno',
    style: `width:${Math.min(pct, 100)}%`,
  }));
  wrap.append(pista);
  return wrap;
}

function fmt(n) {
  if (typeof n !== 'number' || Number.isNaN(n)) return '—';
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

function renderDebrief(resultado, destino) {
  destino.replaceChildren();
  if (resultado.estado === 'incompleta') {
    destino.append(el('p', { class: 'aviso', role: 'status', text: resultado.causas[0].mensaje }));
    return;
  }

  const cabecera = el('div', {
    class: `debrief debrief--${resultado.exito ? 'exito' : 'fallo'}`,
    role: 'status',
  });
  cabecera.append(el('h3', {
    text: resultado.exito
      ? `Misión viable · puntuación ${resultado.puntuacion}`
      : 'Misión no viable',
  }));
  cabecera.append(el('p', {
    text: resultado.exito
      ? 'Todas las restricciones bloqueantes se cumplen. Revisa los avisos si los hay.'
      : 'Hay incompatibilidades. Sigue la cadena causal para corregir la configuración.',
  }));
  destino.append(cabecera);

  const p = resultado.presupuestos;
  destino.append(el('h3', { text: 'Presupuestos' }));
  const barras = el('div', { class: 'director__barras' });
  barras.append(barraUso(p.masaTotalKg, p.capacidadKg, 'Masa (kg)'));
  barras.append(barraUso(p.potenciaUsadaW, p.potenciaDisponibleW, 'Potencia (W)'));
  barras.append(barraUso(p.costoTotal, p.presupuesto, 'Costo (u)'));
  barras.append(barraUso(p.datosDemandadosMbps * 0.35, p.enlaceMbps, 'Datos vs enlace (Mbps eff.)'));
  destino.append(barras);

  destino.append(el('h3', { text: 'Chequeos' }));
  const listaCheques = el('ul', { class: 'chequeos' });
  for (const c of resultado.chequeos) {
    listaCheques.append(el('li', {
      class: c.ok ? 'chequeos__ok' : 'chequeos__fail',
      text: `${c.ok ? '✔' : '✖'} ${c.etiqueta}: ${c.detalle}`,
    }));
  }
  destino.append(listaCheques);

  if (resultado.causas.length) {
    destino.append(el('h3', { text: 'Por qué sale este resultado' }));
    const lista = el('ol', { class: 'causas' });
    for (const causa of resultado.causas) {
      const item = el('li', { class: `causas__item causas__item--${causa.severidad}` });
      item.append(el('p', { text: causa.mensaje }));
      if (causa.cadena?.length) {
        item.append(el('ul', {}, causa.cadena.map((paso) => el('li', { text: paso }))));
      }
      lista.append(item);
    }
    destino.append(lista);
  }

  destino.append(el('p', {
    class: 'nota',
    text: `Periodo orbital calculado: ${fmt(p.periodoHoras)} h · duración útil de la órbita: ${p.duracionUtilDias} días.`,
  }));
}

export function vistaDirector() {
  const estado = {
    objetivoId: OBJETIVOS[0].id,
    busId: BUSES[1].id,
    instrumentoIds: ['camara', 'espectrometro'],
    lanzadorId: LANZADORES[1].id,
    orbitaId: ORBITAS[1].id,
  };

  const contenedor = el('section', { class: 'vista', 'aria-labelledby': 'titulo-director' });
  contenedor.append(el('h1', { id: 'titulo-director', tabindex: '-1', text: 'Director de misión' }));
  contenedor.append(el('p', {
    class: 'lead',
    text: 'Diseña una misión espacial completa: elige objetivo, bus, instrumentos, lanzador y órbita. Cada decisión cambia masa, potencia, presupuesto y enlace de datos.',
  }));
  contenedor.append(el('p', {
    class: 'aviso',
    role: 'note',
    text: 'Respuesta al reto Space Mission Design Game (NASA Space Apps Challenge 2026). Modelo didáctico: los números llevan fuente y supuestos, no son fichas oficiales de vuelo.',
  }));

  const panel = el('div', { class: 'director' });
  const form = el('form', { class: 'director__form', 'aria-label': 'Configuración de la misión' });
  const debrief = el('div', { class: 'director__debrief', 'aria-live': 'polite' });
  const ficha = el('aside', { class: 'director__ficha', 'aria-label': 'Detalle de la selección' });

  function actualizar() {
    const resultado = evaluarMision(estado);
    renderDebrief(resultado, debrief);
    renderFicha(estado, ficha);
  }

  function onRadio(clave) {
    return (ev) => {
      estado[clave] = ev.target.value;
      redibujarForm();
      actualizar();
    };
  }

  function onInstrumento(ev) {
    const id = ev.target.value;
    if (ev.target.checked) {
      if (estado.instrumentoIds.length >= MAX_INSTRUMENTOS) {
        ev.target.checked = false;
        return;
      }
      estado.instrumentoIds = [...estado.instrumentoIds, id];
    } else {
      estado.instrumentoIds = estado.instrumentoIds.filter((x) => x !== id);
    }
    redibujarForm();
    actualizar();
  }

  function redibujarForm() {
    form.replaceChildren();

    form.append(el('h2', { text: '1. Objetivo' }));
    const gObj = el('div', { class: 'opciones', role: 'radiogroup', 'aria-label': 'Objetivo' });
    for (const o of OBJETIVOS) {
      gObj.append(opcionRadio({
        name: 'objetivo',
        value: o.id,
        checked: estado.objetivoId === o.id,
        titulo: o.nombre,
        descripcion: `${o.descripcion} · presupuesto ${o.presupuesto} · ciencia ≥ ${o.cienciaMin} · datos ≥ ${o.datosMinMbps} Mbps`,
        onChange: onRadio('objetivoId'),
      }));
    }
    form.append(gObj);

    form.append(el('h2', { text: '2. Bus' }));
    const gBus = el('div', { class: 'opciones', role: 'radiogroup', 'aria-label': 'Bus' });
    for (const b of BUSES) {
      gBus.append(opcionRadio({
        name: 'bus',
        value: b.id,
        checked: estado.busId === b.id,
        titulo: b.nombre,
        descripcion: `${b.masaKg} kg · ${b.potenciaW} W · antena ${b.antenaMbps} Mbps · costo ${b.costo}`,
        onChange: onRadio('busId'),
      }));
    }
    form.append(gBus);

    form.append(el('h2', { text: `3. Instrumentos (máx. ${MAX_INSTRUMENTOS})` }));
    const gIns = el('div', { class: 'opciones', role: 'group', 'aria-label': 'Instrumentos' });
    for (const i of INSTRUMENTOS) {
      const checked = estado.instrumentoIds.includes(i.id);
      const disabled = !checked && estado.instrumentoIds.length >= MAX_INSTRUMENTOS;
      gIns.append(opcionCheck({
        name: 'instrumento',
        value: i.id,
        checked,
        disabled,
        titulo: i.nombre,
        descripcion: `${i.masaKg} kg · ${i.potenciaW} W · ${i.datosMbps} Mbps · ciencia ${i.ciencia} · costo ${i.costo}`,
        onChange: onInstrumento,
      }));
    }
    form.append(gIns);

    form.append(el('h2', { text: '4. Lanzador' }));
    const gLan = el('div', { class: 'opciones', role: 'radiogroup', 'aria-label': 'Lanzador' });
    for (const l of LANZADORES) {
      gLan.append(opcionRadio({
        name: 'lanzador',
        value: l.id,
        checked: estado.lanzadorId === l.id,
        titulo: l.nombre,
        descripcion: `LEO ${l.capacidadLeoKg} kg · lunar ${l.capacidadLunarKg} kg · destinos: ${l.destinos.join(', ')} · costo ${l.costo}`,
        onChange: onRadio('lanzadorId'),
      }));
    }
    form.append(gLan);

    form.append(el('h2', { text: '5. Órbita' }));
    const gOrb = el('div', { class: 'opciones', role: 'radiogroup', 'aria-label': 'Órbita' });
    for (const o of ORBITAS) {
      const periodo = periodoOrbitalHoras(o);
      gOrb.append(opcionRadio({
        name: 'orbita',
        value: o.id,
        checked: estado.orbitaId === o.id,
        titulo: o.nombre,
        descripcion: `destino ${o.destino} · enlace ×${o.factorEnlace} · margen inserción ${o.margenInsercionKg} kg · periodo ~${periodo.toFixed(2)} h`,
        onChange: onRadio('orbitaId'),
      }));
    }
    form.append(gOrb);

    const acciones = el('div', { class: 'director__acciones' });
    acciones.append(el('button', {
      type: 'button',
      class: 'boton',
      text: 'Evaluar misión',
      onclick: (ev) => {
        ev.preventDefault();
        actualizar();
        debrief.scrollIntoView({ behavior: 'smooth', block: 'start' });
      },
    }));
    acciones.append(el('button', {
      type: 'button',
      class: 'boton boton--secundario',
      text: 'Probar fallo de masa',
      onclick: () => {
        estado.objetivoId = 'orbita-ciencia-lunar';
        estado.busId = 'bus-pesado';
        estado.instrumentoIds = ['radar', 'imagen-hires', 'espectrometro'];
        estado.lanzadorId = 'lanzador-pequeno';
        estado.orbitaId = 'lunar-100';
        redibujarForm();
        actualizar();
      },
    }));
    form.append(acciones);
  }

  function renderFicha(sel, destino) {
    destino.replaceChildren(el('h2', { text: 'Ficha verificable' }));
    destino.append(el('p', {
      class: 'nota',
      text: 'Cada pieza declara fuente, fecha y estado. Los estimados no se presentan como datos oficiales.',
    }));

    const bus = BUSES.find((b) => b.id === sel.busId);
    if (bus) {
      destino.append(el('h3', { text: bus.nombre }));
      destino.append(fichaMagnitud(bus, [
        ['Masa', `${bus.masaKg} kg`],
        ['Potencia', `${bus.potenciaW} W`],
        ['Antena', `${bus.antenaMbps} Mbps`],
        ['Costo', String(bus.costo)],
      ]));
    }

    for (const id of sel.instrumentoIds) {
      const i = INSTRUMENTOS.find((x) => x.id === id);
      if (!i) continue;
      destino.append(el('h3', { text: i.nombre }));
      destino.append(fichaMagnitud(i, [
        ['Masa', `${i.masaKg} kg`],
        ['Potencia', `${i.potenciaW} W`],
        ['Datos', `${i.datosMbps} Mbps`],
        ['Ciencia', String(i.ciencia)],
        ['Costo', String(i.costo)],
      ]));
    }

    const lanzador = LANZADORES.find((l) => l.id === sel.lanzadorId);
    if (lanzador) {
      destino.append(el('h3', { text: lanzador.nombre }));
      destino.append(fichaMagnitud(lanzador, [
        ['Capacidad LEO', `${lanzador.capacidadLeoKg} kg`],
        ['Capacidad lunar', `${lanzador.capacidadLunarKg} kg`],
        ['Costo', String(lanzador.costo)],
      ]));
    }

    const orbita = ORBITAS.find((o) => o.id === sel.orbitaId);
    if (orbita) {
      destino.append(el('h3', { text: orbita.nombre }));
      destino.append(fichaMagnitud(orbita, [
        ['Altitud ref.', `${orbita.altitudKm} km`],
        ['Periodo', `${periodoOrbitalHoras(orbita).toFixed(2)} h`],
        ['Factor de enlace', String(orbita.factorEnlace)],
        ['Margen inserción', `${orbita.margenInsercionKg} kg`],
      ]));
    }
  }

  redibujarForm();
  panel.append(form, ficha, debrief);
  contenedor.append(panel);

  contenedor.append(el('h2', { text: 'Supuestos del modelo' }));
  contenedor.append(el('ul', { class: 'simulador__supuestos' }, SUPUESTOS.map((s) => el('li', { text: s }))));

  contenedor.append(el('h2', { text: 'Fuentes del Director' }));
  const tabla = el('table', { class: 'tabla' });
  tabla.append(el('caption', { text: 'Fuentes citadas por el Director de misión' }));
  const thead = el('thead');
  thead.append(el('tr', {}, [
    el('th', { text: 'ID' }),
    el('th', { text: 'Nombre' }),
    el('th', { text: 'Clase' }),
    el('th', { text: 'Notas' }),
  ]));
  tabla.append(thead);
  const tbody = el('tbody');
  for (const f of FUENTES_DIRECTOR) {
    tbody.append(el('tr', {}, [
      el('td', { text: f.id }),
      el('td', {}, [el('a', { href: f.url, rel: 'noopener noreferrer', text: f.nombre })]),
      el('td', { text: f.clase }),
      el('td', { text: f.notas }),
    ]));
  }
  tabla.append(tbody);
  contenedor.append(tabla);

  actualizar();
  return contenedor;
}
