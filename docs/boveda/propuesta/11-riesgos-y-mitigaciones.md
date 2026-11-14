---
title: "11. Riesgos y mitigaciones"
date: 2026-11-14
tags: [astro-fuente, propuesta]
---

# 11. Riesgos y mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Plazo de 24 horas insuficiente para todo el alcance | Alta | Alto | Fase 1 acotada; orden de prioridad por horas (sección 12); recorte de módulos no esenciales |
| Simulador con cálculos incorrectos o unidades mezcladas | Media | Alto | Tipado en TypeScript; pruebas con los ejemplos de la sección 7; fórmulas visibles |
| Cronogramas de Artemis que cambian | Alta | Medio | Fecha de corte visible y revisión periódica |
| Cifras que difieren entre catálogos | Alta | Medio | Mostrar rangos y fuente por cifra |
| Dependencia de anuncios de SpaceX | Media | Medio | Tratarlos como declaraciones de la empresa |
| Explicaciones imprecisas | Media | Alto | Respuestas solo con citas; sin texto sin respaldo |
| Uso indebido del nombre o logotipo de la NASA | Media | Alto | Sin logotipo; texto que aclara que no hay respaldo |
| Licencias de imágenes o modelos 3D | Media | Medio | Auditoría antes de cada publicación |
| Límite de peticiones de api.nasa.gov | Media | Medio | Caché en Supabase y consultas desde funciones de Vercel |
| Competencia de visores existentes | Alta | Medio | Diferenciar por comparación, fuentes, estado y simulador explicado |
| Desinformación viral | Media | Alto | Estado y fecha de corte en cada dato compartible |

Up: [Propuesta](INDEX.md)

Related: [12. Hoja de ruta de 24 horas y criterios de salida](12-hoja-de-ruta-de-24-horas-y-criterios-de-salida.md) · [14. Correcciones a asesorías previas](14-correcciones-a-asesorias-previas.md) · [9. Viabilidad técnica, legal y de datos](09-viabilidad-tecnica-legal-y-de-datos.md)
