---
title: "7. Simulador: parámetros de ejemplo y fórmulas"
date: 2026-11-14
tags: [astro-fuente, propuesta]
---

# 7. Simulador: parámetros de ejemplo y fórmulas

El simulador necesita datos de entrada explícitos. Cada vehículo de ejemplo aparece con su masa, su peso, su empuje y su fuente. Los valores son aproximados y deben verificarse en la fuente primaria antes de publicarse.

### 7.1 Unidades

- **Masa:** kilogramos (kg) o toneladas (t). 1 t = 1.000 kg.
- **Peso:** newtons (N), calculado como peso = masa × g. El peso no es lo mismo que la masa: cambia según el cuerpo celeste.
- **Empuje:** kilonewtons (kN) o meganewtons (MN). 1 MN = 1.000 kN.
- **Impulso específico (Isp):** segundos (s).
- **Δv:** metros por segundo (m/s) o kilómetros por segundo (km/s).

### 7.2 Gravedad de referencia

| Cuerpo | g (m/s²) | Fuente de referencia | Estado |
| --- | --- | --- | --- |
| Tierra (estándar g₀) | 9,80665 | NIST CODATA: <https://physics.nist.gov/cgi-bin/cuu/Value?gn> (2026-11-14) | verificado en app (`TIERRA-G0`) |
| Luna (superficie) | 1,62 | NSSDC Moon Fact Sheet: <https://nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html> (2026-11-14) | verificado en app (`LUNA-G-SUPERFICIE`) |
| Marte (superficie) | 3,71 | Referencia NASA / factsheet marciano | **[Estimado]** — no publicado en la app hasta leer la ficha primaria |

**Ejemplo de peso de una masa de 80 kg:**

- En la Tierra con g₀: 80 × 9,80665 = **784,532 N** (calculado; ver `TIERRA-G0`)
- En la Luna: 80 × 1,62 = **129,6 N** (calculado; ver `LUNA-PESO-REF-80KG`)
- En Marte: 80 × 3,71 ≈ **297 N** **[Estimado]** — no publicado en la app

La masa sigue siendo de 80 kg en los tres lugares. Solo cambia el peso.

### 7.3 Vehículos de referencia

Todas las filas de esta tabla son **[Estimado]** hasta extracto verificado en `docs/fuentes.md`. No se muestran como cifras en la interfaz del simulador (el caso didáctico es sintético).

| Vehículo | Masa total al despegue | Empuje al despegue | Relación empuje/peso (aprox.) | Fuente a verificar |
| --- | --- | --- | --- | --- |
| Saturn V (Apolo 11) | ≈ 2.970 t **[Estimado]** | ≈ 34,5 MN **[Estimado]** | ≈ 1,18 **[Estimado]** | NASA History: <https://www.nasa.gov/history/> (acceso bloqueado 2026-11-14) |
| Falcon 9 Block 5 | ≈ 549 t **[Estimado]** | ≈ 7,6 MN **[Estimado]** | ≈ 1,41 **[Estimado]** | SpaceX: <https://www.spacex.com/vehicles/falcon-9/> |
| Starship (Super Heavy + Starship) | ≈ 5.000 t **[Estimado]** | ≈ 74 MN **[Estimado]** | ≈ 1,5 **[Estimado]** | SpaceX: <https://www.spacex.com/vehicles/starship/> |

La relación empuje/peso se calcula como empuje ÷ (masa × g). Ejemplo ilustrativo **[Estimado]** para el Saturn V: 34.500 kN ÷ (2.970.000 kg × 9,81 m/s² ÷ 1.000) ≈ 34.500 ÷ 29.136 ≈ 1,18.

### 7.4 Parámetros de motor de ejemplo

| Motor | Empuje a nivel del mar | Isp a nivel del mar | Uso en el simulador |
| --- | --- | --- | --- |
| F-1 (Saturn V, primera etapa) | ≈ 6.770 kN **[Estimado]** | ≈ 263 s **[Estimado]** | No cargado como vehículo real; solo referencia documental |
| Merlin 1D (Falcon 9) | ≈ 845 kN **[Estimado]** | ≈ 282 s **[Estimado]** | No cargado como vehículo real; solo referencia documental |

Los motores de ejemplo permiten al usuario comprobar que el empuje total es la suma del empuje de cada motor, multiplicado por el número de motores. En la app actual el usuario introduce ṁ y vₑ directamente.

### 7.5 Fórmulas del simulador

- **Peso:** P = m × g
- **Relación empuje/peso:** TWR = F ÷ (m × g₀)
- **Aceleración inicial:** a = (F − m × g₀) ÷ m
- **Δv (ecuación del cohete):** Δv = Isp × g₀ × ln(m₀ ÷ m\_f)
- **Masa de propelente:** m\_prop = m₀ − m\_f

Donde m₀ es la masa inicial, m\_f la masa final tras quemar el propelente y g₀ = 9,80665 m/s².

### 7.6 Reglas del simulador

- Cada resultado muestra la fórmula usada y los valores de entrada.
- Cada vehículo muestra su fuente y su fecha de revisión.
- El simulador no modela turbulencia, arrastre atmosférico detallado ni control de actitud en esta fase. Esos supuestos aparecen en una nota visible.
- Si el empuje inicial es menor que el peso, el vehículo no despega. El simulador debe mostrar ese caso con un mensaje claro.
- Los resultados se presentan como cálculos ilustrativos, no como predicciones de misión.

Up: [Propuesta](INDEX.md)

Related: [6. Módulos funcionales y requisitos](06-modulos-funcionales-y-requisitos.md) · [9. Viabilidad técnica, legal y de datos](09-viabilidad-tecnica-legal-y-de-datos.md) · [11. Riesgos y mitigaciones](11-riesgos-y-mitigaciones.md) · [15. Glosario](15-glosario.md) · [2. Desglose de Componentes Clave](../reto/02-desglose-de-componentes-clave.md)
