# Reto: Space Mission Design Game

| Campo | Valor |
|---|---|
| Evento | NASA Space Apps Challenge 2026 |
| Reto | Space Mission Design Game |
| Nivel | Intermediate / Beginner-Youth |
| Entrega | Antes de las 23:59 hora local del evento local (14–15 nov 2026) |
| Jueceo | A partir del 16 nov 2026 |
| Idioma del envío | Inglés (demo/slides/video) |
| Documento | 2026-11-14 |

## Enunciado (resumen)

Crear un juego interactivo que permita diseñar, gestionar y simular una misión espacial completa, con trade-offs entre:

- objetivo de misión
- diseño de nave / bus
- instrumentos científicos
- lanzador
- presupuesto, potencia, masa
- comunicaciones / retorno de datos
- restricciones orbitales

Cada decisión debe mostrar cómo afecta a las demás. El juego debe explicar por qué sale cada resultado.

## Criterios de jueceo (1–5 cada uno)

| Criterio | Qué mide |
|---|---|
| Impact | Beneficio y alcance de la solución |
| Creativity | Originalidad del enfoque |
| Validity | Solidez científica/técnica y usabilidad |
| Relevance | Responde al reto y usa datos NASA de forma significativa |
| Presentation | Claridad del relato y de la demo |

## Cómo responde Astro-fuente

| Requisito del reto | Módulo |
|---|---|
| Loop de diseño de misión | `#/director` (`src/js/director/`) |
| Recursos limitados y compatibilidad | Motor `evaluar.js` (masa, potencia, datos, costo, duración, ciencia, destino) |
| Explicar el resultado | Debrief causal en la vista del Director |
| Datos con procedencia | Fichas con fuente, fecha y estado (`F-AF-DIR`, `F-HORIZONS`) |
| Contexto educativo | Sistema solar, histórico Apolo/Artemis, simulador de vuelo |

## Fuera del MVP de entrega

- Multijugador / modo equipo en vivo (el reto permite individual)
- Vía Láctea / agujeros negros / Marte (fases posteriores)
- Migración a Next.js (el stack de entrega es estático vanilla)
- Consulta en vivo a Horizons (el periodo se calcula con Kepler; Horizons es referencia metodológica)

## Fuentes oficiales a citar en el envío

- [Guía de envío](https://www.spaceappschallenge.org/resources/project-submission-guide/)
- [Guía de jueceo y premios](https://www.spaceappschallenge.org/resources/judging-awards-guide/)
- [FAQs de participantes](https://www.spaceappschallenge.org/resources/participant-faqs/)
- [Challenges 2026](https://www.spaceappschallenge.org/2026/challenges/)
- Datasets sugeridos: JPL Horizons, SBDB, NTRS, NASA Image Library, NASA 3D Resources

## Relacionado

- Propuesta y alcance: [`docs/contexto-proyecto.md`](contexto-proyecto.md)
- Decisiones y bloqueos: [`docs/decisiones.md`](decisiones.md)
- Registro de fuentes: [`docs/fuentes.md`](fuentes.md)
- Despliegue: [`docs/despliegue.md`](despliegue.md)
