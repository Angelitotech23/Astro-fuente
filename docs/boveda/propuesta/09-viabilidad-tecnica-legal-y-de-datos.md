---
title: "9. Viabilidad técnica, legal y de datos"
date: 2026-11-14
tags: [astro-fuente, propuesta]
---

# 9. Viabilidad técnica, legal y de datos

| Capacidad | Viabilidad | Condición |
| --- | --- | --- |
| Datos por objeto desde api.nasa.gov | Alta | Clave gratuita; 1.000 peticiones por hora con clave registrada |
| Imágenes y videos de la NASA | Alta | Uso con crédito a la fuente |
| Efemérides de Horizons (Sol, planetas, lunas, naves) | Alta | Consulta desde una función de Vercel con caché en Supabase |
| Horizons desde el navegador | Baja | Sin cabeceras CORS; requiere backend con caché |
| Trayectorias de misiones pasadas | Media | Reconstrucciones; sin telemetría unificada |
| Trayectorias de misiones activas | Media | Depende de cada misión |
| Agujeros negros en el navegador | Alta | Proyectos de código abierto existentes; revisar licencias |
| Simulador de vuelo simplificado | Alta | Cálculos con fórmulas conocidas y parámetros declarados |
| Publicación automática en redes | Baja | Costos y restricciones de API |
| Uso del logotipo de la NASA | No permitido | Solo con permiso; no sugerir respaldo |

Los datos de la NASA generalmente no tienen derechos de autor en Estados Unidos, pero su uso no debe implicar respaldo de la agencia.

Up: [Propuesta](INDEX.md)

Related: [10. Fuentes de datos y restricciones](10-fuentes-de-datos-y-restricciones.md) · [11. Riesgos y mitigaciones](11-riesgos-y-mitigaciones.md) · [7. Simulador: parámetros de ejemplo y fórmulas](07-simulador-parametros-de-ejemplo-y-formulas.md)
