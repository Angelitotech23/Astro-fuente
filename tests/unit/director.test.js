// Pruebas del motor de trade-offs del Director de misión.
import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  BUSES,
  INSTRUMENTOS,
  LANZADORES,
  MU_LUNAR_KM3_S2,
  ORBITAS,
  RADIO_LUNAR_KM,
  periodoOrbitalHoras,
} from '../../src/js/director/catalogo.js';
import { evaluarMision, presupuestos, resolverSeleccion } from '../../src/js/director/evaluar.js';

test('periodo Kepler lunar de 100 km es razonable (~1,96 h)', () => {
  const orbita = ORBITAS.find((o) => o.id === 'lunar-100');
  const h = periodoOrbitalHoras(orbita);
  const a = RADIO_LUNAR_KM + 100;
  const esperado = (2 * Math.PI * Math.sqrt((a ** 3) / MU_LUNAR_KM3_S2)) / 3600;
  assert.ok(Math.abs(h - esperado) < 1e-9);
  assert.ok(h > 1.8 && h < 2.2, `periodo ${h}`);
});

test('configuración incompleta no se evalúa como éxito', () => {
  const r = evaluarMision({
    objetivoId: null,
    busId: null,
    instrumentoIds: [],
    lanzadorId: null,
    orbitaId: null,
  });
  assert.equal(r.estado, 'incompleta');
  assert.equal(r.exito, false);
});

test('misión lunar viable de referencia tiene éxito', () => {
  const r = evaluarMision({
    objetivoId: 'orbita-ciencia-lunar',
    busId: 'bus-medio',
    instrumentoIds: ['camara', 'espectrometro', 'magnetometro'],
    lanzadorId: 'lanzador-medio',
    orbitaId: 'lunar-100',
  });
  assert.equal(r.exito, true, JSON.stringify(r.causas, null, 2));
  assert.ok(r.puntuacion >= 40);
  const bloqueantes = r.chequeos.filter((c) => c.id !== 'resolucion');
  assert.ok(bloqueantes.every((c) => c.ok), JSON.stringify(bloqueantes.filter((c) => !c.ok)));
});

test('lanzador pequeño no carga bus pesado + radar a la Luna (cadena de masa)', () => {
  const r = evaluarMision({
    objetivoId: 'orbita-ciencia-lunar',
    busId: 'bus-pesado',
    instrumentoIds: ['radar', 'imagen-hires', 'espectrometro'],
    lanzadorId: 'lanzador-pequeno',
    orbitaId: 'lunar-100',
  });
  assert.equal(r.exito, false);
  const masa = r.causas.find((c) => c.id === 'masa');
  assert.ok(masa, 'debe fallar por masa');
  assert.ok(masa.cadena.some((p) => /Bus/.test(p)));
  assert.ok(masa.cadena.some((p) => /Total/.test(p)));
});

test('órbita LEO es incompatible con objetivo lunar', () => {
  const r = evaluarMision({
    objetivoId: 'orbita-ciencia-lunar',
    busId: 'bus-ligero',
    instrumentoIds: ['magnetometro', 'camara'],
    lanzadorId: 'lanzador-medio',
    orbitaId: 'leo-500',
  });
  assert.equal(r.exito, false);
  assert.ok(r.causas.some((c) => c.id === 'destino'));
});

test('presupuesto se agota con bus pesado + lanzador pesado + radar', () => {
  const r = evaluarMision({
    objetivoId: 'demo-leo',
    busId: 'bus-pesado',
    instrumentoIds: ['radar', 'imagen-hires'],
    lanzadorId: 'lanzador-pesado',
    orbitaId: 'leo-500',
  });
  assert.equal(r.exito, false);
  assert.ok(r.causas.some((c) => c.id === 'presupuesto' || c.id === 'potencia' || c.id === 'ciencia'));
});

test('presupuestos suman masa de bus + instrumentos + margen', () => {
  const sel = resolverSeleccion({
    objetivoId: 'demo-leo',
    busId: 'bus-ligero',
    instrumentoIds: ['magnetometro'],
    lanzadorId: 'lanzador-pequeno',
    orbitaId: 'leo-500',
  });
  const p = presupuestos(sel);
  const bus = BUSES.find((b) => b.id === 'bus-ligero');
  const ins = INSTRUMENTOS.find((i) => i.id === 'magnetometro');
  const orb = ORBITAS.find((o) => o.id === 'leo-500');
  assert.equal(p.masaTotalKg, bus.masaKg + ins.masaKg + orb.margenInsercionKg);
  assert.equal(p.capacidadKg, LANZADORES.find((l) => l.id === 'lanzador-pequeno').capacidadLeoKg);
});

test('aviso de resolución cuando hires va a órbita lunar alta', () => {
  const r = evaluarMision({
    objetivoId: 'orbita-ciencia-lunar',
    busId: 'bus-pesado',
    instrumentoIds: ['imagen-hires', 'espectrometro'],
    lanzadorId: 'lanzador-pesado',
    orbitaId: 'lunar-alta',
  });
  // Puede o no ser éxito según potencia/datos; el aviso de resolución debe existir.
  assert.ok(r.causas.some((c) => c.id === 'resolucion' && c.severidad === 'aviso'));
});

test('mensajes del debrief respetan el idioma EN', () => {
  const r = evaluarMision({
    objetivoId: 'orbita-ciencia-lunar',
    busId: 'bus-pesado',
    instrumentoIds: ['radar', 'imagen-hires', 'espectrometro'],
    lanzadorId: 'lanzador-pequeno',
    orbitaId: 'lunar-100',
  }, 'en');
  assert.equal(r.exito, false);
  const masa = r.causas.find((c) => c.id === 'masa');
  assert.ok(masa);
  assert.match(masa.mensaje, /exceeds launcher capacity/i);
  assert.ok(r.chequeos.some((c) => c.id === 'masa' && /Mass vs launcher/i.test(c.etiqueta)));
});
