# Registro de fuentes y datos

Este documento registra cada dato que aparece en la aplicación. Ningún dato se publica sin una entrada aquí.

## Convenciones

- **ID:** identificador único con el formato `MISIÓN-NN` o `GENERAL-NN` (por ejemplo, `APOLO11-01`).
- **Fecha de consulta:** día en que se verificó el dato en la fuente, con formato `AAAA-MM-DD`.
- **Estado:**
  - `verificado`: se confirmó en una fuente primaria o oficial en la fecha indicada.
  - `pendiente`: dato aún no comprobado.
  - `desactualizado`: la fuente cambió o existe información más reciente.
- **Fuente primaria:** preferir sitios oficiales de agencias, documentos técnicos y publicaciones revisadas por pares.

## Plantilla de entrada

| ID | Dato | Valor | Unidad | Fuente (nombre y enlace) | Fecha de consulta | Estado | Notas |
|---|---|---|---|---|---|---|---|
| — | — | — | — | — | — | — | — |

## Catálogo de fuentes

Tabla de fuentes que la base de datos conoce (tabla `fuentes`). Cada fila debe coincidir exactamente con la semilla de `supabase/migrations/20261114000000_esquema_inicial.sql`. La prueba `tests/unit/fuentes-coherencia.test.js` comprueba esa coincidencia en cada CI.

| ID | Nombre | URL | Clase | Notas |
|---|---|---|---|---|
| F-NASA-HO | NASA History Office | <https://www.nasa.gov/history/> | primaria | No consultada: acceso bloqueado por la política de red del 2026-11-14. Pendiente de lectura. |
| F-WTOP | WTOP | <https://wtop.com/national/2026/04/artemis-iis-grand-moon-finale-is-almost-here-with-a-pacific-splashdown-to-cap-nasas-lunar-comeback/> | secundaria | Medio de noticias. Solo para datos pendientes de verificación. |
| F-NTD | NTD | <https://www.ntd.com/artemis-ii-mission-ends-with-splashdown-off-san-diego_1137976.html> | secundaria | Medio de noticias. Solo para datos pendientes de verificación. |
| F-BOEING | Boeing | <https://www.boeing.com/features/2026/04/artemis-ii-crew-back-on-earth-after-historic-lunar-flyby> | secundaria | Contratista de NASA, no es fuente primaria de la agencia. |
| F-SPO | SpacePolicyOnline | <https://spacepolicyonline.com/news/nasa-is-full-steam-ahead-on-artemis-iii-iv-and-v/> | secundaria | Fechas de Artemis III a V. Hay conflicto entre fuentes sobre Artemis III. |
| F-STARLUST-A | Starlust (Artemis III) | <https://starlust.org/nas-as-artemis-iii-new-date-goal-and-everything-else-you-need-to-know/> | secundaria | Fecha de Artemis III. Conflicto con otras fuentes. |
| F-STARLUST-B | Starlust (Artemis IV y V) | <https://starlust.org/heres-what-nasa-is-planning-for-artemis-iv-and-v-now-that-the-roadmap-to-the-moon-has-been-revised/> | secundaria | Previsiones de Artemis IV y V. |
| F-IFS | IFLScience | <https://www.iflscience.com/artemis-iii-has-already-been-pushed-back-to-late-2027-just-2-months-after-nasa-announced-ambitious-new-moon-plan-83377> | secundaria | Indica finales de 2027 para Artemis III. Conflicto con otras fuentes. |
| F-HORIZONS | JPL Horizons System | <https://ssd.jpl.nasa.gov/horizons/> | primaria | Referencia del método de efemérides. El periodo orbital del juego se calcula con Kepler, no se consulta Horizons en vivo en el MVP. |
| F-AF-DIR | Astro-fuente · modelo didáctico del Director | <https://github.com/Angelitotech23/Astro-fuente> | secundaria | Valores de masa, potencia, costo y enlace de datos del juego. Estimados educativos, no fichas oficiales de vuelo. |
| F-NSSDC-EARTH | NASA NSSDC Earth Fact Sheet | <https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html> | primaria | Ficha planetaria de la Tierra (radio, atmósfera, campo magnético, núcleo). Consultada el 2026-11-14. |
| F-NSSDC-MOON | NASA NSSDC Moon Fact Sheet | <https://nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html> | primaria | Ficha de la Luna (radio, gravedad superficial, semieje). Consultada el 2026-11-14. |
| F-NIST-G0 | NIST CODATA · standard acceleration of gravity | <https://physics.nist.gov/cgi-bin/cuu/Value?gn> | primaria | g₀ = 9,80665 m/s² (exacto). Consultada el 2026-11-14. |

## Registro

### Misiones del programa Apolo (1 a 17)

Todos los valores están **pendientes**: no se han leído fuentes primarias. Se completarán con NASA (History Office) y se marcarán como `verificado` solo tras leer la fuente.

| ID | Misión | Tipo | Fecha de lanzamiento | Amerizaje o aterrizaje | Tripulación | Fuente | Fecha de consulta | Estado |
|---|---|---|---|---|---|---|---|---|
| APOLO-01 | Apolo 1 | Tripulada (prueba en tierra) | — | — | — | Pendiente | — | `pendiente` |
| APOLO-02 | Apolo 2 | Sin misión (no existe) | — | — | — | — | — | — |
| APOLO-03 | Apolo 3 | Sin misión (no existe) | — | — | — | — | — | — |
| APOLO-04 | Apolo 4 | No tripulada | — | — | — | Pendiente | — | `pendiente` |
| APOLO-05 | Apolo 5 | No tripulada | — | — | — | Pendiente | — | `pendiente` |
| APOLO-06 | Apolo 6 | No tripulada | — | — | — | Pendiente | — | `pendiente` |
| APOLO-07 | Apolo 7 | Tripulada (órbita terrestre) | — | — | — | Pendiente | — | `pendiente` |
| APOLO-08 | Apolo 8 | Tripulada | — | — | — | Pendiente | — | `pendiente` |
| APOLO-09 | Apolo 9 | Tripulada | — | — | — | Pendiente | — | `pendiente` |
| APOLO-10 | Apolo 10 | Tripulada | — | — | — | Pendiente | — | `pendiente` |
| APOLO-11 | Apolo 11 | Tripulada (alunizaje) | — | — | — | Pendiente | — | `pendiente` |
| APOLO-12 | Apolo 12 | Tripulada (alunizaje) | — | — | — | Pendiente | — | `pendiente` |
| APOLO-13 | Apolo 13 | Tripulada (misión interrumpida) | — | — | — | Pendiente | — | `pendiente` |
| APOLO-14 | Apolo 14 | Tripulada (alunizaje) | — | — | — | Pendiente | — | `pendiente` |
| APOLO-15 | Apolo 15 | Tripulada (alunizaje) | — | — | — | Pendiente | — | `pendiente` |
| APOLO-16 | Apolo 16 | Tripulada (alunizaje) | — | — | — | Pendiente | — | `pendiente` |
| APOLO-17 | Apolo 17 | Tripulada (alunizaje) | — | — | — | Pendiente | — | `pendiente` |

> Nota: la tabla anterior es la lista de identificadores del programa. Los tipos de misión se tomarán de la fuente primaria al verificar cada fila; ninguno está aún confirmado.

### Misiones del programa Artemis (I a V)

| ID | Misión | Tipo previsto | Fecha de lanzamiento | Estado de la misión | Fuente | Fecha de consulta | Estado del dato |
|---|---|---|---|---|---|---|---|
| ARTEMIS-I | Artemis I | No tripulada (sobrevuelo lunar) | — | Pendiente de verificar | Pendiente | — | `pendiente` |
| ARTEMIS-II | Artemis II | Tripulada (sobrevuelo lunar) | 1 de abril de 2026 (secundaria) | Amerizaje el 10 de abril de 2026 frente a San Diego (secundaria) | Fuentes secundarias: [WTOP](https://wtop.com/national/2026/04/artemis-iis-grand-moon-finale-is-almost-here-with-a-pacific-splashdown-to-cap-nasas-lunar-comeback/), [NTD](https://www.ntd.com/artemis-ii-mission-ends-with-splashdown-off-san-diego_1137976.html), [Boeing](https://www.boeing.com/features/2026/04/artemis-ii-crew-back-on-earth-after-historic-lunar-flyby) | 2026-11-14 | `pendiente` (sustituir por fuente NASA) |
| ARTEMIS-III | Artemis III | Prueba tripulada en órbita terrestre (encuentro y acoplamiento con los dos sistemas de alunizaje) | Mediados de 2027 (secundaria) | Una fuente de mayo de 2026 indica finales de 2027 (conflicto sin resolver) | [SpacePolicyOnline](https://spacepolicyonline.com/news/nasa-is-full-steam-ahead-on-artemis-iii-iv-and-v/), [Starlust](https://starlust.org/nas-as-artemis-iii-new-date-goal-and-everything-else-you-need-to-know/), [IFLScience](https://www.iflscience.com/artemis-iii-has-already-been-pushed-back-to-late-2027-just-2-months-after-nasa-announced-ambitious-new-moon-plan-83377) | 2026-11-14 | `pendiente` |
| ARTEMIS-IV | Artemis IV | Primer alunizaje tripulado previsto desde Apolo 17 | Inicios de 2028 (secundaria) | Previsión; NASA no se ha comprometido a lanzar IV y V en 2028 (secundaria) | [SpacePolicyOnline](https://spacepolicyonline.com/news/nasa-is-full-steam-ahead-on-artemis-iii-iv-and-v/), [Starlust](https://starlust.org/heres-what-nasa-is-planning-for-artemis-iv-and-v-now-that-the-roadmap-to-the-moon-has-been-revised/) | 2026-11-14 | `pendiente` |
| ARTEMIS-V | Artemis V | Segundo alunizaje tripulado previsto | Finales de 2028 (secundaria) | Previsión | [Starlust](https://starlust.org/heres-what-nasa-is-planning-for-artemis-iv-and-v-now-that-the-roadmap-to-the-moon-has-been-revised/) | 2026-11-14 | `pendiente` |

> **Advertencia.** Las filas de Artemis marcadas como secundarias provienen de medios y agregadores, no de nasa.gov. Se consultaron por búsqueda web el 2026-11-14; no se pudieron abrir las páginas. Hasta leer el comunicado de NASA, no deben mostrarse como hechos en la aplicación. Las fuentes también se contradicen en la fecha de Artemis III.

### Registro de datos de referencia

| ID | Dato | Valor | Unidad | Fuente | Fecha de consulta | Estado | Notas |
|---|---|---|---|---|---|---|---|
| TIERRA-RADIO-VOL | Radio volumétrico medio de la Tierra | 6371.000 | km | F-NSSDC-EARTH | 2026-11-14 | `verificado` | NSSDC Earth Fact Sheet |
| TIERRA-NUCLEO-RADIO | Radio del núcleo terrestre | 3485 | km | F-NSSDC-EARTH | 2026-11-14 | `verificado` | Estructura interna (módulo A) |
| TIERRA-MANTO-ESPESOR | Espesor del manto | — | km | — | — | `pendiente` | No figura como cifra única en F-NSSDC-EARTH |
| TIERRA-CORTEZA-ESPESOR | Espesor de la corteza | — | km | — | — | `pendiente` | No figura en F-NSSDC-EARTH |
| TIERRA-ATM-PRESION | Presión atmosférica superficial | 1014 | mb | F-NSSDC-EARTH | 2026-11-14 | `verificado` | |
| TIERRA-ATM-ESCALA | Altura de escala atmosférica | 8.5 | km | F-NSSDC-EARTH | 2026-11-14 | `verificado` | |
| TIERRA-ATM-N2 | N₂ en aire seco (por volumen) | 78.08 | % | F-NSSDC-EARTH | 2026-11-14 | `verificado` | |
| TIERRA-ATM-O2 | O₂ en aire seco (por volumen) | 20.95 | % | F-NSSDC-EARTH | 2026-11-14 | `verificado` | |
| TIERRA-MAG-DIPOLO | Intensidad del dipolo geomagnético | 0.306 | Gauss·Re³ | F-NSSDC-EARTH | 2026-11-14 | `verificado` | Modelo GSFC-1283 en la ficha |
| TIERRA-MAG-SUPERFICIE | Campo en superficie (1 Re) | 0.24–0.66 | Gauss | F-NSSDC-EARTH | 2026-11-14 | `verificado` | Rango, no un solo valor |
| TIERRA-G-MEDIA | Gravedad superficial media | 9.820 | m/s² | F-NSSDC-EARTH | 2026-11-14 | `verificado` | Distinta de g₀ estándar |
| TIERRA-G0 | Aceleración estándar de la gravedad g₀ | 9.80665 | m/s² | F-NIST-G0 | 2026-11-14 | `verificado` | Exacto (CODATA) |
| LUNA-RADIO-VOL | Radio volumétrico medio de la Luna | 1737.4 | km | F-NSSDC-MOON | 2026-11-14 | `verificado` | |
| LUNA-G-SUPERFICIE | Gravedad superficial lunar | 1.62 | m/s² | F-NSSDC-MOON | 2026-11-14 | `verificado` | |
| LUNA-DIST-SEMIEJE | Semieje mayor Tierra–Luna | 0.3844×10⁶ | km | F-NSSDC-MOON | 2026-11-14 | `verificado` | 384400 km |
| LUNA-PESO-REF-80KG | Peso de referencia (80 kg) en la Luna | 129.6 | N | F-NSSDC-MOON | 2026-11-14 | `calculado` | P = m · g = 80 × 1.62; g lunar de F-NSSDC-MOON |
| SS-TIERRA-RADIO | Radio medio (sistema solar) | 6371.000 | km | F-NSSDC-EARTH | 2026-11-14 | `verificado` | Alineado con TIERRA-RADIO-VOL |
| SS-TIERRA-DIST | Distancia media al Sol | 1.00000011 | UA | F-NSSDC-EARTH | 2026-11-14 | `verificado` | Elementos J2000 de la ficha |
| SS-TIERRA-PERIODO | Periodo orbital sidéreo | 365.256 | días | F-NSSDC-EARTH | 2026-11-14 | `verificado` | |

### Director de misión (modelo didáctico)

Valores del juego en `src/js/director/catalogo.js`. Son **estimados educativos** salvo los periodos orbitales, que son **calculados** con Kepler (referencia metodológica F-HORIZONS).

| ID | Dato | Valor | Unidad | Fuente | Fecha de consulta | Estado | Notas |
|---|---|---|---|---|---|---|---|
| DIR-BUS-MEDIO-MASA | Masa bus medio | 220 | kg | F-AF-DIR | 2026-11-14 | `estimado` | Ver catálogo completo en código |
| DIR-LUNAR100-PERIODO | Periodo órbita lunar 100 km | ~1,97 | h | F-HORIZONS | 2026-11-14 | `calculado` | Kepler con μ lunar 4902,800066 km³/s² |
| DIR-REGLAS | Reglas de compatibilidad | — | — | F-AF-DIR | 2026-11-14 | `estimado` | Masa, potencia, datos, presupuesto, duración, ciencia |
