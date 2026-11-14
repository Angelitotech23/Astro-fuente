// Interfaz del Director de misión: trade-offs visibles, debrief causal e idioma ES/EN.

import {
  BUSES,
  FUENTES_DIRECTOR,
  INSTRUMENTOS,
  LANZADORES,
  OBJETIVOS,
  ORBITAS,
  etiqueta,
  periodoOrbitalHoras,
} from './catalogo.js';
import { MAX_INSTRUMENTOS, evaluarMision } from './evaluar.js';
import { t } from './i18n.js';
import { el } from '../vistas/util.js';

const LANG_KEY = 'astro-fuente-director-lang';

function leerIdioma() {
  try {
    const v = localStorage.getItem(LANG_KEY);
    if (v === 'en' || v === 'es') return v;
  } catch {
    /* ignore */
  }
  return 'es';
}

function guardarIdioma(lang) {
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch {
    /* ignore */
  }
}

function fmt(n) {
  if (typeof n !== 'number' || Number.isNaN(n)) return '—';
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

function opcionRadio({ name, value, checked, titulo, descripcion, onChange }) {
  const id = `${name}-${value}`;
  const label = el('label', { class: `opcion${checked ? ' opcion--activa' : ''}`, for: id });
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
    class: `opcion${checked ? ' opcion--activa' : ''}${disabled ? ' opcion--deshabilitada' : ''}`,
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

function barraUso(usado, total, etiquetaBarra) {
  const pct = total <= 0 ? 0 : Math.min(100, Math.round((usado / total) * 100));
  const overflow = usado > total;
  const wrap = el('div', { class: 'uso' });
  wrap.append(el('div', {
    class: 'uso__etiqueta',
    text: `${etiquetaBarra}: ${fmt(usado)} / ${fmt(total)} (${pct}%)`,
  }));
  const pista = el('div', {
    class: `uso__pista${overflow ? ' uso__pista--overflow' : ''}`,
    role: 'meter',
    'aria-valuemin': '0',
    'aria-valuemax': String(total),
    'aria-valuenow': String(usado),
    'aria-label': etiquetaBarra,
  });
  const lleno = el('div', { class: 'uso__lleno' });
  lleno.style.width = `${Math.min(pct, 100)}%`;
  pista.append(lleno);
  wrap.append(pista);
  return wrap;
}

function fichaMagnitud(item, campos, ui, lang) {
  const fuente = FUENTES_DIRECTOR.find((f) => f.id === item.fuenteId);
  const lista = el('dl', { class: 'ficha__campos' });
  for (const [termino, valor] of campos) {
    lista.append(el('dt', { text: termino }), el('dd', { text: String(valor) }));
  }
  lista.append(
    el('dt', { text: ui.estado }),
    el('dd', { text: ui.estados[item.estado] ?? item.estado }),
  );
  if (fuente) {
    const nombreFuente = etiqueta(fuente, lang, 'nombre') || fuente.nombre;
    const enlace = el('a', {
      href: fuente.url,
      rel: 'noopener noreferrer',
      text: `${nombreFuente} (${fuente.id})`,
    });
    const dd = el('dd');
    dd.append(enlace);
    lista.append(el('dt', { text: ui.fuente }), dd);
  }
  lista.append(
    el('dt', { text: ui.fecha }),
    el('dd', {}, [el('time', { datetime: item.fechaConsulta, text: item.fechaConsulta })]),
  );
  const supuestos = etiqueta(item, lang, 'supuestos');
  if (supuestos) {
    lista.append(el('dt', { text: ui.supuestos }), el('dd', { text: supuestos }));
  }
  return lista;
}

export function vistaDirector() {
  const estado = {
    lang: leerIdioma(),
    objetivoId: OBJETIVOS[0].id,
    busId: BUSES[1].id,
    instrumentoIds: ['camara', 'espectrometro', 'magnetometro'],
    lanzadorId: LANZADORES[1].id,
    orbitaId: ORBITAS[1].id,
  };

  const contenedor = el('section', { class: 'vista', 'aria-labelledby': 'titulo-director' });
  const cabecera = el('div', { class: 'director__cabecera' });
  const titulo = el('h1', { id: 'titulo-director', tabindex: '-1' });
  const lead = el('p', { class: 'lead' });
  const aviso = el('p', { class: 'aviso', role: 'note' });
  const idiomaBarra = el('div', { class: 'idioma', role: 'group' });
  cabecera.append(titulo, idiomaBarra);
  contenedor.append(cabecera, lead, aviso);

  const panel = el('div', { class: 'director' });
  const form = el('form', { class: 'director__form' });
  const debrief = el('div', { class: 'director__debrief', 'aria-live': 'polite' });
  const ficha = el('aside', { class: 'director__ficha' });
  const supuestosBloque = el('div', { class: 'director__extras' });
  panel.append(form, ficha, debrief);
  contenedor.append(panel, supuestosBloque);

  function ui() {
    return t(estado.lang);
  }

  function renderDebrief(resultado) {
    const u = ui();
    debrief.replaceChildren();
    if (resultado.estado === 'incompleta') {
      debrief.append(el('p', { class: 'aviso', role: 'status', text: resultado.causas[0].mensaje }));
      return;
    }

    const cab = el('div', {
      class: `debrief debrief--${resultado.exito ? 'exito' : 'fallo'}`,
      role: 'status',
    });
    cab.append(el('h3', {
      text: resultado.exito ? u.viable(resultado.puntuacion) : u.noViable,
    }));
    cab.append(el('p', {
      text: resultado.exito ? u.viableTexto : u.noViableTexto,
    }));
    debrief.append(cab);

    const p = resultado.presupuestos;
    debrief.append(el('h3', { text: u.presupuestos }));
    const barras = el('div', { class: 'director__barras' });
    barras.append(barraUso(p.masaTotalKg, p.capacidadKg, u.masa));
    barras.append(barraUso(p.potenciaUsadaW, p.potenciaDisponibleW, u.potencia));
    barras.append(barraUso(p.costoTotal, p.presupuesto, u.costo));
    barras.append(barraUso(p.datosDemandadosMbps * 0.35, p.enlaceMbps, u.datos));
    barras.append(barraUso(
      p.ciencia,
      resultado.resuelto.objetivo.cienciaMin,
      `${u.ciencia} (min)`,
    ));
    debrief.append(barras);

    debrief.append(el('h3', { text: u.chequeos }));
    const listaCheques = el('ul', { class: 'chequeos' });
    for (const c of resultado.chequeos) {
      listaCheques.append(el('li', {
        class: c.ok ? 'chequeos__ok' : 'chequeos__fail',
        text: `${c.ok ? '✔' : '✖'} ${c.etiqueta}: ${c.detalle}`,
      }));
    }
    debrief.append(listaCheques);

    if (resultado.causas.length) {
      debrief.append(el('h3', { text: u.porQue }));
      const lista = el('ol', { class: 'causas' });
      for (const causa of resultado.causas) {
        const item = el('li', { class: `causas__item causas__item--${causa.severidad}` });
        item.append(el('p', { text: causa.mensaje }));
        if (causa.cadena?.length) {
          item.append(el('ul', {}, causa.cadena.map((paso) => el('li', { text: paso }))));
        }
        lista.append(item);
      }
      debrief.append(lista);
    }

    debrief.append(el('p', {
      class: 'nota',
      text: u.periodoNota(fmt(p.periodoHoras), p.duracionUtilDias),
    }));
  }

  function renderFicha(sel) {
    const u = ui();
    const lang = estado.lang;
    ficha.replaceChildren(el('h2', { text: u.fichaTitulo }));
    ficha.append(el('p', { class: 'nota', text: u.fichaNota }));
    ficha.setAttribute('aria-label', u.fichaLabel);

    const bus = BUSES.find((b) => b.id === sel.busId);
    if (bus) {
      ficha.append(el('h3', { text: etiqueta(bus, lang) }));
      ficha.append(fichaMagnitud(bus, [
        [u.masa, `${bus.masaKg} kg`],
        [u.potencia, `${bus.potenciaW} W`],
        ['Antenna / Antena', `${bus.antenaMbps} Mbps`],
        [u.costo, String(bus.costo)],
      ], u, lang));
    }

    for (const id of sel.instrumentoIds) {
      const i = INSTRUMENTOS.find((x) => x.id === id);
      if (!i) continue;
      ficha.append(el('h3', { text: etiqueta(i, lang) }));
      ficha.append(fichaMagnitud(i, [
        [u.masa, `${i.masaKg} kg`],
        [u.potencia, `${i.potenciaW} W`],
        ['Data / Datos', `${i.datosMbps} Mbps`],
        [u.ciencia, String(i.ciencia)],
        [u.costo, String(i.costo)],
      ], u, lang));
    }

    const lanzador = LANZADORES.find((l) => l.id === sel.lanzadorId);
    if (lanzador) {
      ficha.append(el('h3', { text: etiqueta(lanzador, lang) }));
      ficha.append(fichaMagnitud(lanzador, [
        ['LEO', `${lanzador.capacidadLeoKg} kg`],
        ['Lunar', `${lanzador.capacidadLunarKg} kg`],
        [u.costo, String(lanzador.costo)],
      ], u, lang));
    }

    const orbita = ORBITAS.find((o) => o.id === sel.orbitaId);
    if (orbita) {
      ficha.append(el('h3', { text: etiqueta(orbita, lang) }));
      ficha.append(fichaMagnitud(orbita, [
        ['Altitude / Altitud', `${orbita.altitudKm} km`],
        ['Period / Periodo', `${periodoOrbitalHoras(orbita).toFixed(2)} h`],
        ['Link factor / Factor enlace', String(orbita.factorEnlace)],
        ['Insertion margin / Margen', `${orbita.margenInsercionKg} kg`],
      ], u, lang));
    }
  }

  function actualizar() {
    const resultado = evaluarMision(estado, estado.lang);
    renderDebrief(resultado);
    renderFicha(estado);
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

  function aplicarPreset(preset) {
    Object.assign(estado, preset);
    redibujarForm();
    actualizar();
  }

  function redibujarForm() {
    const u = ui();
    const lang = estado.lang;
    form.replaceChildren();
    form.setAttribute('aria-label', u.formLabel);

    form.append(el('h2', { text: u.objetivo }));
    const gObj = el('div', { class: 'opciones', role: 'radiogroup', 'aria-label': u.objetivo });
    for (const o of OBJETIVOS) {
      gObj.append(opcionRadio({
        name: 'objetivo',
        value: o.id,
        checked: estado.objetivoId === o.id,
        titulo: etiqueta(o, lang),
        descripcion: `${etiqueta(o, lang, 'descripcion')} · budget ${o.presupuesto} · science ≥ ${o.cienciaMin} · data ≥ ${o.datosMinMbps} Mbps`,
        onChange: onRadio('objetivoId'),
      }));
    }
    form.append(gObj);

    form.append(el('h2', { text: u.bus }));
    const gBus = el('div', { class: 'opciones', role: 'radiogroup', 'aria-label': u.bus });
    for (const b of BUSES) {
      gBus.append(opcionRadio({
        name: 'bus',
        value: b.id,
        checked: estado.busId === b.id,
        titulo: etiqueta(b, lang),
        descripcion: `${b.masaKg} kg · ${b.potenciaW} W · ${b.antenaMbps} Mbps · cost ${b.costo}`,
        onChange: onRadio('busId'),
      }));
    }
    form.append(gBus);

    form.append(el('h2', { text: u.instrumentos(MAX_INSTRUMENTOS) }));
    const gIns = el('div', { class: 'opciones', role: 'group', 'aria-label': u.instrumentos(MAX_INSTRUMENTOS) });
    for (const i of INSTRUMENTOS) {
      const checked = estado.instrumentoIds.includes(i.id);
      const disabled = !checked && estado.instrumentoIds.length >= MAX_INSTRUMENTOS;
      gIns.append(opcionCheck({
        name: 'instrumento',
        value: i.id,
        checked,
        disabled,
        titulo: etiqueta(i, lang),
        descripcion: `${i.masaKg} kg · ${i.potenciaW} W · ${i.datosMbps} Mbps · science ${i.ciencia} · cost ${i.costo}`,
        onChange: onInstrumento,
      }));
    }
    form.append(gIns);

    form.append(el('h2', { text: u.lanzador }));
    const gLan = el('div', { class: 'opciones', role: 'radiogroup', 'aria-label': u.lanzador });
    for (const l of LANZADORES) {
      gLan.append(opcionRadio({
        name: 'lanzador',
        value: l.id,
        checked: estado.lanzadorId === l.id,
        titulo: etiqueta(l, lang),
        descripcion: `LEO ${l.capacidadLeoKg} kg · lunar ${l.capacidadLunarKg} kg · [${l.destinos.join(', ')}] · cost ${l.costo}`,
        onChange: onRadio('lanzadorId'),
      }));
    }
    form.append(gLan);

    form.append(el('h2', { text: u.orbita }));
    const gOrb = el('div', { class: 'opciones', role: 'radiogroup', 'aria-label': u.orbita });
    for (const o of ORBITAS) {
      const periodo = periodoOrbitalHoras(o);
      gOrb.append(opcionRadio({
        name: 'orbita',
        value: o.id,
        checked: estado.orbitaId === o.id,
        titulo: etiqueta(o, lang),
        descripcion: `${o.destino} · link ×${o.factorEnlace} · margin ${o.margenInsercionKg} kg · ~${periodo.toFixed(2)} h`,
        onChange: onRadio('orbitaId'),
      }));
    }
    form.append(gOrb);

    const acciones = el('div', { class: 'director__acciones' });
    acciones.append(el('button', {
      type: 'button',
      class: 'boton',
      text: u.evaluar,
      onclick: (ev) => {
        ev.preventDefault();
        actualizar();
        debrief.scrollIntoView({ behavior: 'smooth', block: 'start' });
      },
    }));
    acciones.append(el('button', {
      type: 'button',
      class: 'boton boton--secundario',
      text: u.presetOk,
      onclick: () => aplicarPreset({
        objetivoId: 'orbita-ciencia-lunar',
        busId: 'bus-medio',
        instrumentoIds: ['camara', 'espectrometro', 'magnetometro'],
        lanzadorId: 'lanzador-medio',
        orbitaId: 'lunar-100',
      }),
    }));
    acciones.append(el('button', {
      type: 'button',
      class: 'boton boton--secundario',
      text: u.presetFallo,
      onclick: () => aplicarPreset({
        objetivoId: 'orbita-ciencia-lunar',
        busId: 'bus-pesado',
        instrumentoIds: ['radar', 'imagen-hires', 'espectrometro'],
        lanzadorId: 'lanzador-pequeno',
        orbitaId: 'lunar-100',
      }),
    }));
    form.append(acciones);
  }

  function redibujarExtras() {
    const u = ui();
    const lang = estado.lang;
    supuestosBloque.replaceChildren();
    supuestosBloque.append(el('h2', { text: u.supuestosTitulo }));
    supuestosBloque.append(el('ul', {
      class: 'simulador__supuestos',
    }, u.supuestosLista.map((s) => el('li', { text: s }))));

    supuestosBloque.append(el('h2', { text: u.fuentesTitulo }));
    const tabla = el('table', { class: 'tabla' });
    tabla.append(el('caption', { text: u.fuentesCaption }));
    tabla.append(el('thead', {}, [el('tr', {}, [
      el('th', { text: 'ID' }),
      el('th', { text: lang === 'en' ? 'Name' : 'Nombre' }),
      el('th', { text: lang === 'en' ? 'Class' : 'Clase' }),
      el('th', { text: lang === 'en' ? 'Notes' : 'Notas' }),
    ])]));
    const tbody = el('tbody');
    for (const f of FUENTES_DIRECTOR) {
      tbody.append(el('tr', {}, [
        el('td', { text: f.id }),
        el('td', {}, [el('a', {
          href: f.url,
          rel: 'noopener noreferrer',
          text: etiqueta(f, lang, 'nombre') || f.nombre,
        })]),
        el('td', { text: f.clase }),
        el('td', { text: etiqueta(f, lang, 'notas') || f.notas }),
      ]));
    }
    tabla.append(tbody);
    supuestosBloque.append(tabla);
  }

  function redibujarTodo() {
    const u = ui();
    titulo.textContent = u.titulo;
    lead.textContent = u.lead;
    aviso.textContent = u.avisoReto;
    document.documentElement.lang = estado.lang === 'en' ? 'en' : 'es';

    idiomaBarra.replaceChildren(
      el('span', { class: 'idioma__etiqueta', text: `${u.idioma}:` }),
      el('button', {
        type: 'button',
        class: `boton boton--secundario${estado.lang === 'es' ? ' boton--activo' : ''}`,
        text: 'ES',
        'aria-pressed': estado.lang === 'es' ? 'true' : 'false',
        onclick: () => {
          estado.lang = 'es';
          guardarIdioma('es');
          redibujarTodo();
        },
      }),
      el('button', {
        type: 'button',
        class: `boton boton--secundario${estado.lang === 'en' ? ' boton--activo' : ''}`,
        text: 'EN',
        'aria-pressed': estado.lang === 'en' ? 'true' : 'false',
        onclick: () => {
          estado.lang = 'en';
          guardarIdioma('en');
          redibujarTodo();
        },
      }),
    );

    redibujarForm();
    redibujarExtras();
    actualizar();
  }

  redibujarTodo();
  return contenedor;
}
