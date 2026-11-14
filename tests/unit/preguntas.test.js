// Preguntas curadas: solo se publican respuestas con URL de fuente.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PREGUNTAS_CURADAS } from '../../src/js/vistas/preguntas.js';

test('toda pregunta publicada tiene fuente con URL https', () => {
  assert.ok(PREGUNTAS_CURADAS.length > 0);
  for (const p of PREGUNTAS_CURADAS) {
    assert.ok(p.fuente?.url, `${p.id} sin URL`);
    assert.match(p.fuente.url, /^https:\/\//, `${p.id} URL inválida`);
    assert.ok(p.fechaConsulta, `${p.id} sin fecha`);
    assert.match(p.fechaConsulta, /^\d{4}-\d{2}-\d{2}$/, `${p.id} fecha mal formada`);
  }
});

test('las preguntas publicadas citan IDs de fuente del catálogo local', async () => {
  const { FUENTES_LOCALES } = await import('../../src/js/datos/fuentes-locales.js');
  const ids = new Set(FUENTES_LOCALES.map((f) => f.id));
  for (const p of PREGUNTAS_CURADAS) {
    assert.ok(ids.has(p.fuente.id), `${p.id} cita fuente desconocida ${p.fuente.id}`);
  }
});
