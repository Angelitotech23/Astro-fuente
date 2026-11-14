// Pruebas deterministas de la vista de verificabilidad (sección 10 del prompt).
import { test } from 'node:test';
import assert from 'node:assert/strict';

import { diasEntre, UMBRAL_DESACTUALIZADO_DIAS, vistaDato } from '../../src/js/componentes/dato.js';

const FUENTES = [
  { id: 'F-NASA-HO', nombre: 'NASA History Office', url: 'https://www.nasa.gov/history/', clase: 'primaria' },
  { id: 'F-WTOP', nombre: 'WTOP', url: 'https://wtop.com/x', clase: 'secundaria' },
];
const HOY = '2026-11-14';

const base = {
  id: 'TEST-1',
  etiqueta: 'Radio medio',
  valor: '4880',
  unidad: 'km',
  tipo: 'medido',
  estado: 'verificado',
  fuente_id: 'F-NASA-HO',
  fecha_consulta: '2026-11-01',
  metodo: null,
  supuestos: null,
};

test('pendiente: no muestra cifra aunque la fila tuviera valor', () => {
  const v = vistaDato({ ...base, estado: 'pendiente', valor: '4880', fuente_id: null, fecha_consulta: null }, FUENTES, HOY);
  assert.equal(v.valorTexto, null);
  assert.equal(v.mensajePendiente, 'Pendiente de verificación');
  assert.equal(v.estadoTexto, 'Pendiente de verificación');
});

test('verificado reciente: muestra valor, unidad, fuente y fecha', () => {
  const v = vistaDato(base, FUENTES, HOY);
  assert.equal(v.estado, 'verificado');
  assert.equal(v.valorTexto, '4880 km');
  assert.equal(v.fuente.nombre, 'NASA History Office');
  assert.equal(v.fuente.clase, 'primaria');
  assert.equal(v.fechaConsulta, '2026-11-01');
  assert.deepEqual(v.avisos, []);
});

test('verificado con más de 90 días pasa a desactualizado con aviso', () => {
  const v = vistaDato({ ...base, fecha_consulta: '2026-07-01' }, FUENTES, HOY);
  assert.equal(v.estado, 'desactualizado');
  assert.equal(v.estadoTexto, 'Desactualizado');
  assert.equal(v.avisos.length, 1);
  assert.equal(v.valorTexto, '4880 km');
});

test('exactamente 90 días sigue verificado; 91 pasa a desactualizado', () => {
  assert.equal(UMBRAL_DESACTUALIZADO_DIAS, 90);
  const d90 = '2026-08-16';
  const d91 = '2026-08-15';
  assert.equal(diasEntre(d90, HOY), 90);
  assert.equal(vistaDato({ ...base, fecha_consulta: d90 }, FUENTES, HOY).estado, 'verificado');
  assert.equal(vistaDato({ ...base, fecha_consulta: d91 }, FUENTES, HOY).estado, 'desactualizado');
});

test('verificado sin fuente registrada se degrada a pendiente con aviso', () => {
  const v = vistaDato({ ...base, fuente_id: 'F-INEXISTENTE' }, FUENTES, HOY);
  assert.equal(v.estado, 'pendiente');
  assert.equal(v.valorTexto, null);
  assert.equal(v.avisos.length, 1);
});

test('la fecha de referencia acepta un Date y es determinista', () => {
  const v = vistaDato({ ...base, fecha_consulta: '2026-07-01' }, FUENTES, new Date('2026-11-14T12:00:00Z'));
  assert.equal(v.estado, 'desactualizado');
});

test('calculado muestra método; estimado muestra supuestos', () => {
  const calc = vistaDato({ ...base, tipo: 'calculado', metodo: 'RK4, paso 1e-3' }, FUENTES, HOY);
  assert.equal(calc.metodo, 'RK4, paso 1e-3');
  assert.equal(calc.supuestos, null);
  const est = vistaDato({ ...base, tipo: 'estimado', supuestos: 'Sin arrastre' }, FUENTES, HOY);
  assert.equal(est.supuestos, 'Sin arrastre');
  assert.equal(est.metodo, null);
});

test('el estado tiene texto e icono, no solo color', () => {
  for (const estado of ['verificado', 'pendiente', 'desactualizado']) {
    const v = vistaDato({ ...base, estado, valor: estado === 'pendiente' ? null : '1', fuente_id: estado === 'pendiente' ? null : 'F-NASA-HO', fecha_consulta: estado === 'pendiente' ? null : HOY }, FUENTES, HOY);
    assert.ok(v.estadoTexto.length > 0);
    assert.ok(v.estadoIcono.length > 0);
  }
});
