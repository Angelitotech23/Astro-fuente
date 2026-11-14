// Interfaz del simulador de fase única: controles, gráficas, resumen, fórmulas y supuestos.

import { CASO_DIDACTICO } from './modelo.js';
import { G0, metricasCohete, referencias, simularVuelo } from './simulacion.js';
import { el, svg } from '../vistas/util.js';

const CAMPOS = [
  { clave: 'm0', etiqueta: 'Masa inicial m₀', paso: '0.01', min: '0.001' },
  { clave: 'mf', etiqueta: 'Masa seca m_f', paso: '0.01', min: '0.001' },
  { clave: 'mdot', etiqueta: 'Caudal de propelente ṁ', paso: '0.01', min: '0.001' },
  { clave: 've', etiqueta: 'Velocidad efectiva de escape vₑ', paso: '0.01', min: '0.001' },
  { clave: 'g', etiqueta: 'Gravedad g', paso: '0.01', min: '0' },
];

const SUPUESTOS = [
  'Modelo simplificado de una sola fase, vertical.',
  'Sin arrastre atmosférico.',
  'Gravedad g constante.',
  'Caudal de propelente ṁ constante durante toda la combustión.',
  'Sin control de actitud ni frenado.',
  'Tras la combustión, retorno balístico hasta el impacto con el suelo (h = 0).',
  'Unidades SI coherentes. El caso didáctico es sintético y no corresponde a ningún vehículo real.',
];

const fmt = (x) => (x === null || x === undefined || Number.isNaN(x) ? '—' : Number(x).toFixed(6));

function formulas(p, ref) {
  return [
    {
      titulo: 'Tiempo de combustión',
      formula: 't_b = (m₀ − m_f) / ṁ',
      sustituida: `(${p.m0} − ${p.mf}) / ${p.mdot} = ${fmt(ref.tb)}`,
    },
    {
      titulo: 'Velocidad al agotarse el propelente',
      formula: 'v_b = vₑ · ln(m₀ / m_f) − g · t_b',
      sustituida: `${p.ve} · ln(${p.m0} / ${p.mf}) − ${p.g} · ${fmt(ref.tb)} = ${fmt(ref.vb)}`,
    },
    {
      titulo: 'Altura al agotarse el propelente',
      formula: 'h_b = vₑ · t_b − (vₑ · m_f / ṁ) · ln(m₀ / m_f) − g · t_b² / 2',
      sustituida: `${fmt(ref.hb)}`,
    },
    {
      titulo: 'Altura máxima',
      formula: 'h_max = h_b + v_b² / (2g)',
      sustituida: ref.hmax === null ? 'No acotada (g = 0)' : fmt(ref.hmax),
    },
    {
      titulo: 'Velocidad de impacto',
      formula: '|v_imp| = √(v_b² + 2g · h_b)',
      sustituida: ref.vimp === null ? 'No aplica (g = 0)' : fmt(ref.vimp),
    },
  ];
}

function graficar(titulo, puntos, claveY, unidad) {
  const w = 320;
  const h = 150;
  const margen = { l: 44, r: 8, t: 10, b: 26 };
  const grafico = svg('svg', {
    viewBox: `0 0 ${w} ${h}`,
    class: 'grafica',
    role: 'img',
    'aria-label': `${titulo} frente al tiempo`,
  });
  if (puntos.length < 2) {
    grafico.append(svg('text', { x: w / 2, y: h / 2, 'text-anchor': 'middle', class: 'grafica__texto' }, ['Sin datos']));
    return grafico;
  }
  const tMax = puntos[puntos.length - 1].t || 1;
  let yMin = Infinity;
  let yMax = -Infinity;
  for (const p of puntos) {
    if (p[claveY] < yMin) yMin = p[claveY];
    if (p[claveY] > yMax) yMax = p[claveY];
  }
  if (yMax - yMin < 1e-9) { yMax += 1; yMin -= 1; }
  const x = (t) => margen.l + (t / tMax) * (w - margen.l - margen.r);
  const y = (v) => margen.t + (1 - (v - yMin) / (yMax - yMin)) * (h - margen.t - margen.b);

  grafico.append(svg('line', { x1: margen.l, y1: y(0), x2: w - margen.r, y2: y(0), class: 'grafica__eje' }));
  grafico.append(svg('line', { x1: margen.l, y1: margen.t, x2: margen.l, y2: h - margen.b, class: 'grafica__eje' }));
  grafico.append(svg('text', { x: 4, y: margen.t + 8, class: 'grafica__texto' }, [yMax.toFixed(2)]));
  grafico.append(svg('text', { x: 4, y: h - margen.b, class: 'grafica__texto' }, [yMin.toFixed(2)]));
  grafico.append(svg('text', { x: w - margen.r, y: h - 8, 'text-anchor': 'end', class: 'grafica__texto' }, [`t (${tMax.toFixed(2)})`]));
  grafico.append(svg('text', { x: margen.l, y: 9, class: 'grafica__texto' }, [`${titulo} (${unidad})`]));

  // Submuestreo para no dibujar miles de segmentos.
  const paso = Math.max(1, Math.floor(puntos.length / 600));
  const coords = [];
  for (let i = 0; i < puntos.length; i += paso) coords.push(`${x(puntos[i].t).toFixed(1)},${y(puntos[i][claveY]).toFixed(1)}`);
  grafico.append(svg('polyline', { points: coords.join(' '), class: 'grafica__linea', fill: 'none' }));
  return grafico;
}

export function vistaSimulador() {
  const estado = { ...CASO_DIDACTICO };
  const contenedor = el('section', { class: 'vista', 'aria-labelledby': 'titulo-simulador' });
  contenedor.append(el('h1', { id: 'titulo-simulador', tabindex: '-1', text: 'Simulador de vuelo' }));
  contenedor.append(el('p', {
    text: 'Modelo simplificado de una fase vertical. Cambia los parámetros y el resultado se recalcula al momento. El caso didáctico es sintético.',
  }));

  const form = el('form', { class: 'simulador__form', onsubmit: (e) => e.preventDefault(), novalidate: true });
  const inputs = {};
  for (const c of CAMPOS) {
    const id = `campo-${c.clave}`;
    const input = el('input', {
      id, type: 'number', step: c.paso, min: c.min, value: estado[c.clave], inputmode: 'decimal',
      oninput: () => {
        const v = Number(input.value);
        estado[c.clave] = input.value === '' ? NaN : v;
        recalcular();
      },
    });
    inputs[c.clave] = input;
    form.append(el('div', { class: 'campo' }, [el('label', { for: id, text: c.etiqueta }), input]));
  }
  const reset = el('button', {
    type: 'button',
    class: 'boton',
    text: 'Restablecer caso didáctico',
    onclick: () => {
      for (const c of CAMPOS) {
        estado[c.clave] = CASO_DIDACTICO[c.clave];
        inputs[c.clave].value = String(CASO_DIDACTICO[c.clave]);
      }
      recalcular();
    },
  });
  form.append(el('div', { class: 'campo campo--boton' }, [reset]));

  const avisos = el('div', { class: 'simulador__avisos', role: 'alert' });
  const resumen = el('div', { class: 'simulador__resumen', 'aria-live': 'polite' });
  const graficas = el('div', { class: 'simulador__graficas' });
  const panelFormulas = el('div', { class: 'simulador__formulas' });
  const supuestos = el('ul', { class: 'simulador__supuestos' }, SUPUESTOS.map((s) => el('li', { text: s })));

  contenedor.append(
    form,
    avisos,
    resumen,
    graficas,
    el('h2', { text: 'Fórmulas con los valores actuales' }),
    panelFormulas,
    el('h2', { text: 'Supuestos del modelo' }),
    supuestos,
  );

  function recalcular() {
    const p = { m0: estado.m0, mf: estado.mf, mdot: estado.mdot, ve: estado.ve, g: estado.g };
    const sim = simularVuelo(p, { dt: 1e-3 });

    avisos.replaceChildren(...[...sim.errores ?? [], ...sim.avisos ?? []].map((t) => el('p', { class: 'aviso', text: t })));

    if (!sim.valido) {
      resumen.replaceChildren(el('p', { text: 'Corrige los valores para ver el resultado.' }));
      graficas.replaceChildren();
      panelFormulas.replaceChildren();
      return;
    }

    const ref = referencias(p);
    const r = sim.resumen;
    if (!sim.sinDespegue && r) {
      resumen.replaceChildren(el('dl', { class: 'resumen' }, [
        el('dt', { text: 'Tiempo de combustión t_b' }), el('dd', { text: fmt(r.tb) }),
        el('dt', { text: 'Velocidad al agotarse v_b' }), el('dd', { text: fmt(r.vb) }),
        el('dt', { text: 'Altura al agotarse h_b' }), el('dd', { text: fmt(r.hb) }),
        el('dt', { text: 'Altura máxima h_max' }), el('dd', { text: r.hmax === null ? 'No acotada (g = 0)' : fmt(r.hmax) }),
        el('dt', { text: 'Velocidad de impacto |v_imp|' }), el('dd', { text: r.vimp === null ? 'No aplica (g = 0)' : fmt(r.vimp) }),
        el('dt', { text: 'Instante de impacto' }), el('dd', { text: r.tImpacto === null ? 'No alcanzado' : fmt(r.tImpacto) }),
      ]));
    } else {
      resumen.replaceChildren(el('p', { text: 'Sin resultado: el cohete no despega con estos valores.' }));
    }

    const muestras = sim.muestras;
    const puntos = muestras.map((m) => ({ t: m.t, h: m.h, v: m.v, a: m.a }));
    graficas.replaceChildren(
      graficar('Altura h(t)', puntos, 'h', 'm'),
      graficar('Velocidad v(t)', puntos, 'v', 'm/s'),
      graficar('Aceleración a(t)', puntos, 'a', 'm/s²'),
    );
    const m = metricasCohete(p);
    const extras = [
      {
        titulo: 'Impulso específico',
        formula: 'Isp = vₑ / g₀',
        sustituida: `${p.ve} / ${G0} = ${fmt(m.isp)} s`,
      },
      {
        titulo: 'Relación empuje/peso (TWR)',
        formula: 'TWR = ṁ · vₑ / (m₀ · g₀)',
        sustituida: `${p.mdot} · ${p.ve} / (${p.m0} · ${G0}) = ${fmt(m.twr)}`,
      },
      {
        titulo: 'Δv ideal (sin gravedad ni arrastre)',
        formula: 'Δv = vₑ · ln(m₀ / m_f)',
        sustituida: `${p.ve} · ln(${p.m0} / ${p.mf}) = ${fmt(m.deltaV)}`,
      },
    ];
    panelFormulas.replaceChildren(...[...formulas(p, ref), ...extras].map((f) => el('article', { class: 'formula' }, [
      el('h3', { text: f.titulo }),
      el('p', { class: 'formula__simbolica', text: f.formula }),
      el('p', { class: 'formula__sustituida', text: `= ${f.sustituida}` }),
    ])));
  }

  recalcular();
  return contenedor;
}
