// Coherencia entre docs/fuentes.md (registro legible) y la semilla de la tabla `fuentes`.
// Si esta prueba falla, cambia ambos lugares en la misma PR.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

function leerFuentesDeDocumentacion() {
  const texto = readFileSync(join(RAIZ, 'docs', 'fuentes.md'), 'utf8');
  const inicio = texto.indexOf('## Catálogo de fuentes');
  assert.ok(inicio >= 0, 'docs/fuentes.md debe tener la sección "Catálogo de fuentes"');
  const seccion = texto.slice(inicio).split(/\n## /)[0];
  const filas = seccion.split('\n').filter((l) => /^\| F-/.test(l));
  return filas.map((l) => {
    const celdas = l.split('|').slice(1, -1).map((c) => c.trim());
    assert.equal(celdas.length, 5, `fila mal formada: ${l}`);
    const [id, nombre, urlMarcada, clase, notas] = celdas;
    // La URL va entre <> (autolink) para cumplir MD034; se quitan para comparar.
    const url = urlMarcada.replace(/^<(.*)>$/, '$1');
    return { id, nombre, url, clase, notas };
  });
}

function desescapar(s) {
  return s.replace(/''/g, "'");
}

function leerFuentesDeSemilla() {
  const dir = join(RAIZ, 'supabase', 'migrations');
  const archivo = readdirSync(dir).find((f) => f.endsWith('esquema_inicial.sql'));
  assert.ok(archivo, 'falta la migración inicial');
  const sql = readFileSync(join(dir, archivo), 'utf8');
  const bloque = sql.slice(sql.indexOf('INSERT INTO public.fuentes'));
  const cuerpo = bloque.slice(0, bloque.indexOf(';'));
  const re = /\('((?:[^']|'')*)',\s*'((?:[^']|'')*)',\s*'((?:[^']|'')*)',\s*'(primaria|secundaria)',\s*'((?:[^']|'')*)'\)/g;
  const filas = [];
  let m;
  while ((m = re.exec(cuerpo)) !== null) {
    filas.push({
      id: desescapar(m[1]),
      nombre: desescapar(m[2]),
      url: desescapar(m[3]),
      clase: m[4],
      notas: desescapar(m[5]),
    });
  }
  return filas;
}

test('el catálogo de docs/fuentes.md y la semilla SQL tienen los mismos IDs', () => {
  const doc = leerFuentesDeDocumentacion();
  const sql = leerFuentesDeSemilla();
  assert.ok(doc.length > 0, 'el catálogo de la documentación está vacío');
  assert.deepEqual(
    sql.map((f) => f.id).sort(),
    doc.map((f) => f.id).sort(),
  );
});

test('nombre, URL, clase y notas coinciden entre documentación y semilla', () => {
  const doc = new Map(leerFuentesDeDocumentacion().map((f) => [f.id, f]));
  for (const f of leerFuentesDeSemilla()) {
    const d = doc.get(f.id);
    assert.ok(d, `${f.id} no está en docs/fuentes.md`);
    assert.equal(d.nombre, f.nombre, `nombre de ${f.id}`);
    assert.equal(d.url, f.url, `url de ${f.id}`);
    assert.equal(d.clase, f.clase, `clase de ${f.id}`);
    assert.equal(d.notas, f.notas, `notas de ${f.id}`);
  }
});

test('todo ID de fuente citado en la semilla de datos existe en el catálogo', () => {
  const sql = readFileSync(join(RAIZ, 'supabase', 'migrations', '20261114000000_esquema_inicial.sql'), 'utf8');
  const ids = new Set(leerFuentesDeSemilla().map((f) => f.id));
  const citados = [...sql.matchAll(/'(F-[A-Z0-9-]+)'/g)].map((m) => m[1]);
  for (const c of citados) assert.ok(ids.has(c), `fuente citada sin registrar: ${c}`);
});
