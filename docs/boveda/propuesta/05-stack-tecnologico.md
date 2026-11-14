---
title: "5. Stack tecnológico"
date: 2026-11-14
tags: [astro-fuente, propuesta]
---

# 5. Stack tecnológico

| Capa | Tecnología | Uso en el proyecto |
| --- | --- | --- |
| Lenguaje | TypeScript | Tipado de parámetros físicos (masa en kg, empuje en N, Isp en s) para evitar errores de unidad |
| Interfaz | React con Next.js | Páginas de Observatorio, Vuelo, Director de misión y Futuro |
| Visualización | Canvas 2D o SVG; three.js para la Tierra y la Luna | Escalas, trayectorias y modelos 3D ligeros |
| Gráficas | Recharts | Perfiles de altitud, velocidad y aceleración durante la simulación |
| Hosting y funciones | Vercel | Despliegue, rutas de servidor para consultar NASA Open APIs y JPL Horizons |
| Base de datos | Supabase (PostgreSQL) | Fichas verificadas, perfiles de vehículos, fuentes y caché de respuestas de Horizons |
| Almacenamiento | Supabase Storage | Imágenes y videos oficiales con crédito |
| Secretos | Variables de entorno en Vercel | Clave de api.nasa.gov; nunca en el código del cliente |

Las consultas a JPL Horizons se hacen desde funciones de Vercel con caché en Supabase, porque Horizons no permite consultas directas desde el navegador (sin cabeceras CORS).

Up: [Propuesta](INDEX.md)

Related: [13. Decisiones del proyecto](13-decisiones-del-proyecto.md) · [7. Simulador: parámetros de ejemplo y fórmulas](07-simulador-parametros-de-ejemplo-y-formulas.md)
