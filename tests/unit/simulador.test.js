// Pruebas analíticas y de convergencia del simulador de fase única.
import { test } from 'node:test';
import assert from 'node:assert/strict';

import { CASO_DIDACTICO, derivadas, tiempoCombustion } from '../../src/js/simulador/modelo.js';
import { integrar, pasoEuler, pasoRK4 } from '../../src/js/simulador/integrador.js';
import { referencias, simularVuelo, validarParametros } from '../../src/js/simulador/simulacion.js';

const TOL = 1e-6;

function relErr(a, b) {
  return Math.abs(a - b) / Math.max(Math.abs(b), 1e-12);
}

// Solo la fase propulsada, con el mismo modelo que usa simularVuelo.
function integrarQuema(p, pasos, paso) {
  const tb = tiempoCombustion(p);
  const f = (t, y) => derivadas(t, y, p, true);
  const { y } = integrar(paso, f, 0, [0, 0, p.m0], tb / pasos, pasos);
  return { h: y[0], v: y[1], m: y[2] };
}

test('caso didáctico con g = 0,1: valores de referencia', () => {
  const p = { ...CASO_DIDACTICO, g: 0.1 };
  const r = referencias(p);
  assert.equal(r.tb, 1);
  assert.ok(relErr(r.vb, 0.593147) < TOL, `v_b = ${r.vb}`);
  assert.ok(relErr(r.hb, 0.256853) < TOL, `h_b = ${r.hb}`);
});

test('caso didáctico con g = 0: h_b de referencia', () => {
  const r = referencias({ ...CASO_DIDACTICO, g: 0 });
  assert.ok(relErr(r.hb, 0.306853) < TOL, `h_b = ${r.hb}`);
  assert.equal(r.hmax, null);
  assert.equal(r.vimp, null);
});

test('g = 0 reproduce Tsiolkovsky: v_b = v_e · ln(m0/mf)', () => {
  const p = { m0: 5, mf: 2, mdot: 0.7, ve: 3, g: 0 };
  const r = referencias(p);
  assert.ok(relErr(r.vb, p.ve * Math.log(p.m0 / p.mf)) < 1e-12);
});

test('la fórmula analítica de h_b coincide con la integración numérica de la quema', () => {
  const p = { ...CASO_DIDACTICO, g: 0.1 };
  const num = integrarQuema(p, 2000, pasoRK4);
  const ref = referencias(p);
  assert.ok(relErr(num.h, ref.hb) < TOL, `h numérica ${num.h} vs analítica ${ref.hb}`);
  assert.ok(relErr(num.v, ref.vb) < TOL, `v numérica ${num.v} vs analítica ${ref.vb}`);
  assert.ok(relErr(num.m, p.mf) < 1e-12, 'la masa al final de la quema es mf');
});

test('h_max e |v_imp| coinciden con la integración completa', () => {
  const p = { ...CASO_DIDACTICO, g: 0.1 };
  const sim = simularVuelo(p, { dt: 1e-4 });
  const ref = referencias(p);
  assert.equal(sim.resumen.sinImpacto, false);
  assert.ok(relErr(sim.resumen.hmax, ref.hmax) < 1e-5, `h_max ${sim.resumen.hmax} vs ${ref.hmax}`);
  assert.ok(relErr(sim.resumen.vimp, ref.vimp) < 1e-5, `|v_imp| ${sim.resumen.vimp} vs ${ref.vimp}`);
  assert.ok(relErr(sim.resumen.vb, ref.vb) < TOL);
});

test('convergencia: RK4 tiene orden 4 en la quema', () => {
  const p = { ...CASO_DIDACTICO, g: 0.1 };
  const exacto = referencias(p).hb;
  const errores = [64, 128, 256].map((n) => Math.abs(integrarQuema(p, n, pasoRK4).h - exacto));
  for (let i = 0; i < 2; i += 1) {
    const orden = Math.log2(errores[i] / errores[i + 1]);
    assert.ok(Math.abs(orden - 4) < 0.2, `orden observado ${orden}`);
  }
});

test('convergencia: Euler tiene orden 1 en la quema', () => {
  const p = { ...CASO_DIDACTICO, g: 0.1 };
  const exacto = referencias(p).hb;
  const errores = [256, 512, 1024].map((n) => Math.abs(integrarQuema(p, n, pasoEuler).h - exacto));
  for (let i = 0; i < 2; i += 1) {
    const orden = Math.log2(errores[i] / errores[i + 1]);
    assert.ok(Math.abs(orden - 1) < 0.1, `orden observado ${orden}`);
  }
});

test('la masa usada en la dinámica es la del estado, no m0', () => {
  const p = { ...CASO_DIDACTICO, g: 0 };
  const [, dv] = derivadas(0.5, [0, 0, 1.5], p); // m(0,5) = 1,5, no m0 = 2
  assert.ok(relErr(dv, p.mdot * p.ve / 1.5) < 1e-12);
});

test('validación: mf ≥ m0 y valores no positivos son errores', () => {
  assert.equal(validarParametros({ m0: 1, mf: 1, mdot: 1, ve: 1, g: 0 }).valido, false);
  assert.equal(validarParametros({ m0: 2, mf: 1, mdot: 0, ve: 1, g: 0 }).valido, false);
  assert.equal(validarParametros({ m0: 2, mf: 1, mdot: 1, ve: 1, g: -1 }).valido, false);
  assert.equal(validarParametros({ m0: 2, mf: 1, mdot: 1, ve: 1, g: 0.1 }).valido, true);
});

test('aviso cuando el empuje no supera el peso', () => {
  const v = validarParametros({ m0: 10, mf: 1, mdot: 1, ve: 1, g: 9.8 });
  assert.equal(v.valido, true);
  assert.ok(v.avisos.length > 0);
  const sim = simularVuelo({ m0: 10, mf: 1, mdot: 1, ve: 1, g: 9.8 }, { dt: 1e-3 });
  assert.equal(sim.sinDespegue, true);
});
