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
| — | Sin datos verificados todavía | — | — | — | — | — | Completar con fuentes primarias antes de la primera versión pública |
