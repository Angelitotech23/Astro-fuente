# Astro-fuente

**EN** · A verifiable web simulator for space exploration. Every value shows its source, retrieval date, and verification status. Built for the **NASA Space Apps Challenge 2026**, challenge *Space Mission Design Game*.

**ES** · Simulador web de exploración espacial **verificable**. Cada dato muestra su fuente, su fecha de consulta y su estado. Desarrollado para el **NASA Space Apps Challenge 2026**, reto *Space Mission Design Game*.

> **Independent project.** Not affiliated with, endorsed by, or sponsored by NASA or any other agency or company mentioned.
> **Proyecto independiente.** Sin afiliación, respaldo ni patrocinio de la NASA ni de otras agencias o empresas mencionadas.

---

## English

### What it is

A static web app (no build step). UI language: **EN+ES**.

| Module | Route | What it does |
| --- | --- | --- |
| Mission Director | `#/director` | Mission-design game: pick objective, bus, instruments, launcher and orbit. Each choice has trade-offs and a causal debrief. |
| Observatory | `#/observatorio` | Earth and Moon fact sheets (structure, atmosphere, magnetic field, lunar inventory). |
| Solar system | `#/sistema-solar` | Navigable 2D schematic. Orbits are not to scale; Earth values verified (NSSDC), others pending. |
| History | `#/historico` | Apollo 1–17 and Artemis II timeline. Dates are pending verification. |
| Trajectories | `#/mision/apolo-11`, `#/mision/artemis-ii` | Schematic Earth–Moon–Earth paths, without figures. |
| Flight simulator | `#/simulador` | One-phase vertical rocket model with visible formulas and assumptions. |
| Curated questions | `#/preguntas` | Short answers with source URL and retrieval date. |
| Future programs | `#/futuro` | Artemis III–V planned milestones with cut-off date. |
| Sources | `#/fuentes` | Readable registry of every cited source. |

### Principles

| Principle | In practice |
| --- | --- |
| **Verifiability** | Every datum has a source, a retrieval date, and a status: `verificado`, `pendiente`, or `desactualizado`. Unsourced "verified" data is downgraded to "pending". |
| **Transparent math** | Simulator formulas appear next to their results, with their assumptions. |
| **No invented numbers** | Data without a checked primary source shows no figure. |
| **Independence** | Not affiliated with NASA. |

### Status

| Module | Status |
| --- | --- |
| Mission Director | Playable MVP |
| Observatory | MVP; Earth/Moon fields with NSSDC/NIST where readable |
| Solar system | MVP, 2D; Earth verified, others pending |
| History and trajectories | MVP; dates pending, schematic paths |
| Flight simulator | MVP, single phase; formulas + no-liftoff case |
| Curated questions | MVP; URL-backed answers only |
| Supabase backend | Schema and seed written; project not created yet |
| Vercel deploy | Documented; not created yet |

### Run locally

No build step. Serve the repository root and open the app in a browser.

```bash
# macOS / Linux
python3 -m http.server 8080

# Windows
py -m http.server 8080
```

Then open `http://localhost:8080/#/director`. Without a database the app still works and marks data as pending.

### Tests

```bash
npm test
```

The tests cover the physics model against analytic references, the verifiability rules, and the consistency between the source catalog in the docs, the SQL seed, and the local fallback. Tests need Node 22 or later and no dependencies.

### Documentation

- [`docs/reto-space-mission-design-game.md`](docs/reto-space-mission-design-game.md): challenge mapping
- [`docs/director-mision.md`](docs/director-mision.md): Mission Director rules
- [`docs/fuentes.md`](docs/fuentes.md): source registry
- [`docs/despliegue.md`](docs/despliegue.md): Vercel and Supabase deploy steps
- [`docs/decisiones.md`](docs/decisiones.md): design decisions
- [`docs/contexto-proyecto.md`](docs/contexto-proyecto.md): full project context
- [`CONTRIBUTING.md`](CONTRIBUTING.md): contribution guide

### Security

Never commit keys, tokens, private keys, or `.env` files. CI fails if one is tracked. [`.env.example`](.env.example) is a template only. Public Supabase values, when they exist, go in `src/js/config.js`. Never put a `service_role` key in the repository.

### License

To be defined by the team.

---

## Español

### Qué es

Aplicación web estática (sin paso de compilación). Idioma de interfaz: **ES+EN**.

| Módulo | Ruta | Qué hace |
| --- | --- | --- |
| Director de misión | `#/director` | Juego de diseño de misión: elige objetivo, bus, instrumentos, lanzador y órbita. Cada elección tiene compromisos y un debrief causal. |
| Observatorio | `#/observatorio` | Fichas de Tierra y Luna (estructura, atmósfera, campo magnético, inventario lunar). |
| Sistema solar | `#/sistema-solar` | Esquema 2D navegable. Tierra verificada (NSSDC); resto pendiente. |
| Histórico | `#/historico` | Línea de tiempo de Apolo 1 a 17 y Artemis II. Las fechas están pendientes de verificación. |
| Trayectorias | `#/mision/apolo-11`, `#/mision/artemis-ii` | Trayectorias Tierra–Luna–Tierra esquemáticas, sin cifras. |
| Simulador de vuelo | `#/simulador` | Modelo vertical de una fase con fórmulas y supuestos visibles. |
| Preguntas curadas | `#/preguntas` | Respuestas breves con fuente URL y fecha de consulta. |
| Programas futuros | `#/futuro` | Artemis III–V con estado y fecha de corte. |
| Fuentes | `#/fuentes` | Registro legible de cada fuente citada. |

### Principios

| Principio | En la práctica |
| --- | --- |
| **Verificabilidad** | Cada dato tiene fuente, fecha de consulta y estado: `verificado`, `pendiente` o `desactualizado`. Un dato "verificado" sin fuente se degrada a "pendiente". |
| **Cálculo transparente** | Las fórmulas del simulador se muestran junto al resultado, con sus supuestos. |
| **Sin cifras inventadas** | Un dato sin fuente primaria comprobada no muestra cifra. |
| **Independencia** | Sin afiliación con la NASA. |

### Estado

| Módulo | Estado |
| --- | --- |
| Director de misión | MVP jugable |
| Observatorio | MVP; Tierra/Luna con NSSDC/NIST donde se pudo leer |
| Sistema solar | MVP, 2D; Tierra verificada, resto pendiente |
| Histórico y trayectorias | MVP; fechas pendientes, trayectorias esquemáticas |
| Simulador de vuelo | MVP, fase única; fórmulas y caso «no despega» |
| Preguntas curadas | MVP; solo respuestas con URL |
| Backend Supabase | Esquema y semilla escritos; proyecto aún no creado |
| Despliegue en Vercel | Documentado; aún no creado |

### Ejecutar en local

Sirve la raíz del repositorio y abre el navegador.

```bash
# macOS / Linux
python3 -m http.server 8080

# Windows
py -m http.server 8080
```

Luego abre `http://localhost:8080/#/director`. Sin base de datos, la app funciona y marca los datos como pendientes.

### Pruebas

```bash
npm test
```

Las pruebas cubren el modelo físico frente a referencias analíticas, las reglas de verificabilidad y la coherencia entre el catálogo de fuentes de la documentación, la semilla SQL y el respaldo local. Requieren Node 22 o superior y no tienen dependencias.

### Documentación

- [`docs/reto-space-mission-design-game.md`](docs/reto-space-mission-design-game.md): mapeo al reto
- [`docs/director-mision.md`](docs/director-mision.md): reglas del Director
- [`docs/fuentes.md`](docs/fuentes.md): registro de fuentes
- [`docs/despliegue.md`](docs/despliegue.md): pasos de despliegue en Vercel y Supabase
- [`docs/decisiones.md`](docs/decisiones.md): decisiones de diseño
- [`docs/contexto-proyecto.md`](docs/contexto-proyecto.md): contexto completo del proyecto
- [`CONTRIBUTING.md`](CONTRIBUTING.md): guía de contribución

### Seguridad

No subir claves, tokens, claves privadas ni archivos `.env`. La CI falla si alguno está versionado. [`.env.example`](.env.example) es solo una plantilla. Los valores públicos de Supabase, cuando existan, van en `src/js/config.js`. Nunca pongas la clave `service_role` en el repositorio.

### Licencia

Pendiente de definir por el equipo.

---

## Estructura del repositorio / Repository layout

```text
.
├── index.html             Punto de entrada (sin build) / Entry point
├── vercel.json            Cabeceras de despliegue estático / Static deploy headers
├── src/js/app.js          Enrutador por hash / Hash router
├── src/js/director/       Director de misión: catálogo, evaluación, vista
├── src/js/simulador/      Modelo de vuelo, integrador RK4, vista
├── src/js/vistas/         Vistas: inicio, observatorio, preguntas, sistema solar, histórico, fuentes
├── src/js/componentes/    Componente `dato` (verificabilidad)
├── src/js/datos/          Cliente Supabase de solo lectura y respaldo local
├── supabase/migrations/   Esquema, RLS y semilla / Schema, RLS and seed
├── tests/unit/            Pruebas de Node (`npm test`)
├── tests/db/              Pruebas SQL de restricciones / SQL constraint checks
└── docs/                  Reto, fuentes, decisiones, despliegue
```
