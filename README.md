# Astro-fuente

**EN** · Verifiable web simulator for space exploration: every value shows its source, retrieval date, and verification status. Built for the **NASA Space Apps Challenge 2026** challenge *Space Mission Design Game*.

**ES** · Simulador web de exploración espacial **verificable**: cada dato muestra su fuente, fecha de consulta y estado. Desarrollado para el **NASA Space Apps Challenge 2026** (reto *Space Mission Design Game*).

> Independent project — not affiliated with NASA or any other agency or company mentioned.  
> Proyecto independiente — sin afiliación con la NASA ni con otras agencias o empresas mencionadas.

---

## English

### What it is

Astro-fuente is a static web app that combines:

- **Mission Director** (`#/director`) — interactive mission-design game with trade-offs (objective, bus, instruments, launcher, orbit) and a causal debrief; every quantity cites a source and assumptions.
- **Solar system viewer** — navigable 2D overview (data pending primary verification).
- **Apollo / Artemis history** — timeline and schematic trajectories for Apollo 11 and Artemis II.
- **Flight simulator** — single-phase rocket model with visible formulas and assumptions.
- **Sources registry** — human-readable catalog of every cited source.

### Principles

| Principle | In practice |
| --- | --- |
| **Verifiability** | Every datum includes source, retrieval date, and status (`verified`, `pending`, `outdated`). |
| **Transparent math** | Simulator formulas are shown next to the result. |
| **Independence** | Not affiliated with or endorsed by NASA. |
| **Facts vs opinion** | Critical commentary is labeled and backed by public sources. |

### Project status

| Module | Status |
| --- | --- |
| Mission Director | Playable MVP |
| Solar system | MVP (2D; values pending verification) |
| Apollo 1–17 & Artemis II | MVP (pending dates; schematic paths) |
| Flight simulator | MVP (single phase) |
| Future programs / news | Not in MVP |
| Supabase + Vercel deploy | Documented, not created yet |

### Run locally

No build step. Serve the repo root:

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080` (try `#/director`). Without a database, the app still runs and marks data as pending.

```bash
npm test
```

### Docs (mostly Spanish for the team)

- [`docs/reto-space-mission-design-game.md`](docs/reto-space-mission-design-game.md) — challenge mapping
- [`docs/director-mision.md`](docs/director-mision.md) — Mission Director rules
- [`docs/despliegue.md`](docs/despliegue.md) — future Vercel / Supabase deploy
- [`docs/fuentes.md`](docs/fuentes.md) — sources registry
- [`docs/contexto-proyecto.md`](docs/contexto-proyecto.md) — full project context
- [`CONTRIBUTING.md`](CONTRIBUTING.md) — contribution guide

### License

To be defined by the team.

---

## Español

### Qué es

Astro-fuente es una aplicación web estática que reúne:

- **Director de misión** (`#/director`) — juego de diseño de misión con trade-offs (objetivo, bus, instrumentos, lanzador, órbita) y debrief causal; cada magnitud cita fuente y supuestos.
- **Visor del sistema solar** — vista 2D navegable (datos pendientes de verificación primaria).
- **Histórico Apolo / Artemis** — línea de tiempo y trayectorias esquemáticas de Apolo 11 y Artemis II.
- **Simulador de vuelo** — modelo de una fase con fórmulas y supuestos visibles.
- **Registro de fuentes** — catálogo legible de cada fuente citada.

### Principios

| Principio | En la práctica |
| --- | --- |
| **Verificabilidad** | Todo dato incluye fuente, fecha de consulta y estado (`verificado`, `pendiente`, `desactualizado`). |
| **Transparencia del cálculo** | Las fórmulas del simulador se muestran junto al resultado. |
| **Independencia** | El proyecto no está afiliado ni respaldado por la NASA. |
| **Hechos vs opinión** | Las valoraciones críticas se etiquetan y se apoyan en fuentes públicas. |

### Estado del proyecto

| Módulo | Estado |
| --- | --- |
| Director de misión | MVP jugable |
| Sistema solar | MVP (2D; valores pendientes) |
| Apolo 1–17 y Artemis II | MVP (fechas pendientes; esquemas) |
| Simulador de vuelo | MVP (fase única) |
| Programas futuros / noticias | Fuera del MVP |
| Despliegue Supabase + Vercel | Documentado; aún no creado |

### Ejecutar en local

Sin paso de compilación. Sirve la raíz del repositorio:

```bash
python3 -m http.server 8080
```

Abre `http://localhost:8080` (prueba `#/director`). Sin base de datos, la app funciona y marca los datos como pendientes.

```bash
npm test
```

### Documentación

- [`docs/reto-space-mission-design-game.md`](docs/reto-space-mission-design-game.md) — mapeo al reto Space Apps
- [`docs/director-mision.md`](docs/director-mision.md) — reglas del Director
- [`docs/despliegue.md`](docs/despliegue.md) — despliegue futuro en Vercel / Supabase
- [`docs/fuentes.md`](docs/fuentes.md) — registro de fuentes
- [`docs/contexto-proyecto.md`](docs/contexto-proyecto.md) — contexto completo
- [`CONTRIBUTING.md`](CONTRIBUTING.md) — guía de contribución

### Seguridad

No subir claves, tokens ni archivos `.env`. Usa [`.env.example`](.env.example) solo como plantilla. Los valores públicos de Supabase viven en `src/js/config.js` cuando existan.

### Licencia

Pendiente de definir por el equipo.

---

## Repository layout / Estructura

```text
.
├── index.html            Entry point (no build) / Punto de entrada
├── vercel.json           Static deploy hints / Pistas de despliegue
├── src/js/director/      Mission Director / Director de misión
├── src/js/simulador/     Flight model / Modelo de vuelo
├── src/js/componentes/   Verifiability widget / Componente dato
├── docs/                 Challenge, sources, deploy notes
├── supabase/migrations/  Schema + seed (optional backend)
└── tests/unit/           Node tests (`npm test`)
```
