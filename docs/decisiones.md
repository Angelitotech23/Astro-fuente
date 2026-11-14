# Decisiones y bloqueos del MVP

Estado al 2026-11-14 (America/La_Paz). Sesión sin persona disponible para confirmar acciones en cuentas externas: ninguna escritura en Supabase ni Vercel.

## 1. Decisiones que solo puede tomar la persona dueña

| # | Decisión | Estado | Motivo y siguiente paso |
|---|---|---|---|
| 1 | Crear el proyecto Supabase (región sugerida `us-east-1`) | **Pendiente de confirmación** | No se creó nada en la cuenta. Al confirmar: aplicar `supabase/migrations/20261114000000_esquema_inicial.sql` y anotar URL y clave publicable en `src/js/config.js`. |
| 2 | Crear el proyecto Vercel enlazado al repositorio | **Pendiente de confirmación** | No se enlazó nada. Procedimiento en `docs/despliegue.md`. |
| 3 | Acceso a nasa.gov | **Bloqueado por la red** | `www.nasa.gov` devolvió **403** desde el proxy de la sesión. NSSDC (`nssdc.gsfc.nasa.gov`) y NIST sí respondieron. Consecuencia: misiones Apolo/Artemis siguen `pendiente` salvo datos NSSDC/NIST del Observatorio. |
| 4 | Licencia del repositorio | **Pendiente de confirmación** | Sin archivo `LICENSE`. |
| 5 | Migrar a Next.js + TypeScript (bóveda §5) | **No decidido por el agente** | El repo ya está en vanilla JS. Cambiar el stack es decisión de la persona dueña. |

## 2. Bloqueos técnicos

| Bloqueo | Efecto | Cómo se resolverá |
|---|---|---|
| `cdn.jsdelivr.net` puede devolver **403** en esta red | `supabase-js` no carga aquí. La app funciona con semilla local. | Comprobar en preview de Vercel. |
| Sin proyecto Supabase | Criterios contra la base real sin verificar. | Tras la decisión 1. |
| Sin preview de Vercel | Criterio HTTP 200 de fase 0 sin verificar. | Tras la decisión 2. |

## 3. Hecho en esta pasada (alineación con la bóveda)

- **Observatorio (`#/observatorio`)**: fichas de Tierra (módulo A) y Luna (módulo C) con campos obligatorios. Valores verificados solo desde NSSDC/NIST; manto/corteza y misiones lunares quedan `pendiente` sin cifra.
- **Preguntas curadas (`#/preguntas`)**: publicadas solo las respuestas con fuente URL (NIST/NSSDC). Ver sección 6 para las pendientes.
- **Fuentes §7 y §16**: URLs y fechas añadidas donde fue posible; cifras de vehículos/motores marcadas **[Estimado]** y no publicadas en la UI.
- **Idioma**: decisión cerrada como **ES+EN** en `docs/boveda/propuesta/13-decisiones-del-proyecto.md` y aquí.
- **Simulador**: cada resultado muestra fórmulas (P, Isp, TWR, a₀, Δv, m_prop) y supuestos; caso «No despega» con mensaje claro (F ≤ m₀·g).
- **Puerta A**: rutas revisadas en navegador local (ver sección 5).

## 4. Datos y contenido

- **Programas futuros (Artemis III–V)** en `#/futuro` como planificados, con fecha de corte y fuentes; no como verificados.
- **Métricas del simulador**: Isp, TWR y Δv con g₀ = 9,80665 m/s² y fórmula visible.
- **Misiones**: siguen `pendiente` (bloqueo nasa.gov). Artemis II con fuentes secundarias, sin cifra.
- **Sistema solar**: Tierra (radio, distancia, periodo) verificada con F-NSSDC-EARTH; el resto permanece `pendiente`.
- **Inventario lunar robótico**: pendiente (sin fuente primaria con criterio común).

## 5. Verificación

| Criterio | Estado |
|---|---|
| `npm test` | Debe pasar en CI/local tras esta pasada |
| `node --check` de `.js` modificados | Debe pasar |
| Restricciones SQL contra Supabase | No ejecutado (sin proyecto) |
| Preview Vercel / Playwright | Pendiente (sin preview) |
| Puerta A en navegador local (`python3 -m http.server 8080`) | **Cumplido** el 2026-11-14 (America/La_Paz): rutas `#/`, `#/director`, `#/observatorio`, `#/sistema-solar`, `#/historico`, `#/mision/apolo-11`, `#/mision/artemis-ii`, `#/simulador` (fórmulas, supuestos y «No despega»), `#/preguntas`, `#/futuro`, `#/fuentes` cargan; pie con aviso de no afiliación a la NASA; sin respaldo sugerido. Corregido typo `noDespegue`/`noDespega` que bloqueaba el simulador. |
| Coherencia `docs/fuentes.md` ↔ semilla ↔ `fuentes-locales.js` | Cubierto por `tests/unit/fuentes-coherencia.test.js` |

## 6. Preguntas curadas pendientes (sin URL / «literatura estándar»)

No publicadas en `#/preguntas`:

| Tema | Motivo |
|---|---|
| Masa/empuje/Isp de Saturn V, Falcon 9, Starship, F-1, Merlin | Solo **[Estimado]** en §7; sin extracto verificado en el registro |
| Gravedad superficial de Marte 3,71 m/s² y peso 80 kg en Marte | Factsheet marciano no leído en esta sesión |
| Conteos de satélites activos / catálogos azmth | Sin URL primaria comprobada |
| Inventario completo de alunizajes robóticos | Sin fuente primaria con criterio común de éxito/fallo |

## 7. Decisiones técnicas tomadas

- **Director y MVP en vanilla JS** (sin migrar a Next.js).
- Números del Director: estimados didácticos (`F-AF-DIR`) salvo periodos Kepler (`F-HORIZONS` metodológico).
- `package.json` mínimo, sin dependencias de runtime.
- Semilla local (`src/js/datos/semilla-local.js`) para Observatorio sin Supabase.
- Simulador: quema en `n` pasos hasta `t_b`; fase explícita en `derivadas`.
- `valor` como `text` en la base.
- Fuentes con la misma página en dos periodos (Starlust) = dos IDs.
