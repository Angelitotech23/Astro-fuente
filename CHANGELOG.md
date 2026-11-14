# Changelog

Todos los cambios relevantes de este proyecto se documentan en este archivo.

El formato se basa en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y el proyecto usa [Versionado Semántico](https://semver.org/lang/es/) a partir de la primera versión publicada.

## [Sin publicar]

### Añadido

- Director de misión (`#/director`): juego de trade-offs con objetivo, bus, instrumentos, lanzador y órbita; presupuestos de masa/potencia/datos/costo; debrief causal; fichas con fuente y supuestos; pruebas unitarias del motor.
- Fuentes `F-HORIZONS` y `F-AF-DIR` para el modelo del Director.
- Documentación del reto Space Apps, del Director y del despliegue futuro (`docs/reto-space-mission-design-game.md`, `docs/director-mision.md`, `docs/despliegue.md`).
- `vercel.json` preparado para sitio estático (sin crear proyecto aún).
- MVP de la aplicación (fases 1 a 5): sistema solar 2D navegable con teclado, histórico Apolo 1 a 17 como línea de tiempo, trayectorias esquemáticas de Apolo 11 y Artemis II, simulador de fase única con gráficas, fórmulas sustituidas y supuestos.
- Componente de verificabilidad `dato`: muestra fuente, fecha de consulta y estado; los datos pendientes no muestran cifra; los verificados con más de 90 días pasan a desactualizados.
- Esquema inicial de Supabase en `supabase/migrations/` con restricciones de verificabilidad y RLS de solo lectura para `anon`.
- Pruebas unitarias del modelo físico (referencias analíticas y orden de convergencia de RK4 y Euler), del componente `dato` y de coherencia entre `docs/fuentes.md` y la base.
- Pruebas de restricciones y RLS en `tests/db/restricciones.sql`.
- Catálogo de fuentes en `docs/fuentes.md`.
- Registro de decisiones y bloqueos en `docs/decisiones.md`.
- Job de pruebas unitarias en el flujo de validación.

- Estructura base del repositorio: README, guía de contribución y registro de fuentes.
- Plantillas de pull request e issues (reporte de error y dato o fuente).
- Contexto del proyecto en `docs/contexto-proyecto.md`.
- Registro de misiones Apolo 1 a 17 y Artemis I a V en `docs/fuentes.md`, con estado pendiente de verificación.
- Configuración de lint de Markdown y flujo de CI para validar cada cambio.

## [0.0.0] - 2026-11-14

- Primer commit del repositorio (`4fa8daa`), con el README inicial.
