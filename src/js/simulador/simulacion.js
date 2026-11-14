// Simulación de una fase vertical y referencias analíticas.
// Ver modelo.js para los supuestos y las ecuaciones.

import { aceleracion, derivadas, empuje, tiempoCombustion } from './modelo.js';
import { integrar, pasoRK4 } from './integrador.js';

const LIMITE_PASOS_POR_DEFECTO = 200000;

/**
 * Valida parámetros. Devuelve { valido, errores, avisos }.
 * - errores: impiden simular (valores no positivos, mf ≥ m0).
 * - avisos: se muestran, pero no impiden simular (empuje no mayor que el peso).
 */
export function validarParametros(p) {
  const errores = [];
  const avisos = [];
  const campos = ['m0', 'mf', 'mdot', 've', 'g'];
  for (const c of campos) {
    if (typeof p[c] !== 'number' || !Number.isFinite(p[c])) {
      errores.push(`El valor de ${c} no es un número válido.`);
    }
  }
  if (errores.length) return { valido: false, errores, avisos };

  for (const c of ['m0', 'mf', 'mdot', 've']) {
    if (p[c] <= 0) errores.push(`${c} debe ser mayor que 0.`);
  }
  if (p.g < 0) errores.push('g no puede ser negativa.');
  if (p.mf >= p.m0) errores.push('La masa seca mf debe ser menor que la masa inicial m0.');

  if (!errores.length) {
    if (empuje(p) <= p.m0 * p.g) {
      avisos.push('El empuje inicial no supera el peso: el cohete no despegará.');
    }
  }
  return { valido: errores.length === 0, errores, avisos };
}

/**
 * Referencias analíticas (sin arrastre, g constante).
 *   v_b = v_e·ln(m0/mf) − g·t_b
 *   h_b = v_e·t_b − (v_e·mf/ṁ)·ln(m0/mf) − g·t_b²/2
 *   h_max = h_b + v_b²/(2g)           (solo con g > 0)
 *   |v_imp| = √(v_b² + 2g·h_b)        (solo con g > 0)
 */
export function referencias(p) {
  const tb = tiempoCombustion(p);
  const L = Math.log(p.m0 / p.mf);
  const vb = p.ve * L - p.g * tb;
  const hb = p.ve * tb - (p.ve * p.mf / p.mdot) * L - (p.g * tb * tb) / 2;
  const hayGravedad = p.g > 0;
  const hmax = hayGravedad ? hb + (Math.max(vb, 0) ** 2) / (2 * p.g) : null;
  const vimpSq = vb * vb + 2 * p.g * hb;
  const vimp = hayGravedad && vimpSq >= 0 ? Math.sqrt(vimpSq) : null;
  return { tb, vb, hb, hmax, vimp };
}

function muestra(t, y, p) {
  return { t, h: y[0], v: y[1], m: y[2], a: aceleracion(t, y, p) };
}

/**
 * Simula el vuelo con RK4 y devuelve muestras y un resumen.
 * La combustión se integra en exactamente n pasos que terminan en t_b,
 * para no cruzar la discontinuidad del empuje dentro de un paso.
 * La fase balística se integra con paso dt hasta el impacto (h = 0).
 */
export function simularVuelo(p, { dt = 0.001, maxPasos = LIMITE_PASOS_POR_DEFECTO } = {}) {
  const validacion = validarParametros(p);
  if (!validacion.valido) {
    return { ...validacion, muestras: [], resumen: null };
  }

  const ref = referencias(p);
  const fQuema = (t, y) => derivadas(t, y, p, true);
  const fBalistica = (t, y) => derivadas(t, y, p, false);
  const muestras = [muestra(0, [0, 0, p.m0], p)];

  // Fase propulsada.
  const nQuema = Math.max(1, Math.ceil(ref.tb / dt));
  const hQuema = ref.tb / nQuema;
  let y = [0, 0, p.m0];
  let sinDespegue = false;
  integrar(pasoRK4, fQuema, 0, y, hQuema, nQuema, (t, yNuevo) => {
    if (sinDespegue) return;
    if (yNuevo[0] < 0) {
      sinDespegue = true;
      return;
    }
    y = yNuevo;
    muestras.push(muestra(t, y, p));
  });
  if (sinDespegue) {
    return {
      ...validacion,
      avisos: [...validacion.avisos, 'El cohete no despega: la altura sería negativa durante la combustión.'],
      sinDespegue: true,
      muestras,
      resumen: null,
    };
  }
  // Fijar el instante exacto del agotamiento.
  y = [y[0], y[1], p.mf];
  let t = ref.tb;
  const indiceBurnout = muestras.length - 1;
  muestras[indiceBurnout] = muestra(t, y, p);

  // Fase balística hasta el impacto o hasta el límite de pasos.
  let tImpacto = null;
  let pasos = 0;
  while (pasos < maxPasos) {
    const yAnterior = y;
    const tAnterior = t;
    y = pasoRK4(fBalistica, t, y, dt);
    t = tAnterior + dt;
    pasos += 1;
    if (y[0] <= 0) {
      const alfa = yAnterior[0] / (yAnterior[0] - y[0]);
      tImpacto = tAnterior + alfa * dt;
      const yImpacto = [0, yAnterior[1] + alfa * (y[1] - yAnterior[1]), y[2]];
      muestras.push(muestra(tImpacto, yImpacto, p));
      break;
    }
    muestras.push(muestra(t, y, p));
  }

  let hmax = -Infinity;
  for (const m of muestras) if (m.h > hmax) hmax = m.h;

  const resumen = {
    tb: ref.tb,
    vb: muestras[indiceBurnout].v,
    hb: muestras[indiceBurnout].h,
    hmax: p.g > 0 ? hmax : null,
    vimp: tImpacto === null ? null : Math.abs(muestras[muestras.length - 1].v),
    tImpacto,
    sinImpacto: tImpacto === null,
  };

  const avisos = [...validacion.avisos];
  if (tImpacto === null) {
    avisos.push('No se alcanzó el impacto dentro del límite de simulación (con g = 0 el vehículo no vuelve).');
  }
  return { ...validacion, avisos, sinDespegue: false, muestras, resumen, referencias: ref };
}
