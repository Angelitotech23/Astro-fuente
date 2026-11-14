# Director de misión

Módulo jugable que cubre el núcleo del reto *Space Mission Design Game*.

## Ruta

`#/director` → `src/js/director/vista.js`

## Archivos

| Archivo | Rol |
|---|---|
| `src/js/director/catalogo.js` | Objetivos, buses, instrumentos, lanzadores, órbitas y fuentes |
| `src/js/director/evaluar.js` | Motor puro: presupuestos, chequeos y debrief causal |
| `src/js/director/vista.js` | UI de selección, barras de uso y ficha verificable |
| `tests/unit/director.test.js` | Casos de éxito, fallo de masa, destino, Kepler |

## Flujo del jugador

1. Elegir **objetivo** (ciencia lunar, reconocimiento lunar o demo LEO).
2. Elegir **bus** (masa, potencia, antena, costo).
3. Elegir hasta **3 instrumentos**.
4. Elegir **lanzador** (capacidad LEO/lunar y destinos).
5. Elegir **órbita** (destino, factor de enlace, margen de inserción).
6. Leer el **debrief**: éxito/fallo, puntuación, barras y cadena causal.

## Reglas (bloqueantes)

- Destino del objetivo = destino de órbita y del lanzador
- Masa total (bus + instrumentos + margen de inserción) ≤ capacidad del lanzador
- Potencia usada ≤ potencia del bus
- Enlace efectivo ≥ máximo(mínimo del objetivo, 35 % de la demanda de instrumentos)
- Costo total ≤ presupuesto del objetivo
- Duración útil de la órbita ≥ 75 % de la duración pedida
- Ciencia acumulada ≥ mínimo del objetivo

Aviso no bloqueante: imagen hires en órbita lunar alta.

## Verificabilidad

Cada pieza del catálogo declara `fuenteId`, `fechaConsulta`, `estado` (`estimado` o `calculado`) y `supuestos`. Fuentes registradas en `docs/fuentes.md`: `F-AF-DIR`, `F-HORIZONS`.
