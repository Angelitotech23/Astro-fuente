# Decisiones y bloqueos del MVP

Estado al 2026-11-14. Sesión sin persona disponible para confirmar: ninguna acción de escritura en cuentas externas se ha ejecutado.

## 1. Decisiones de la sección 5 del prompt

| # | Decisión | Estado | Motivo y siguiente paso |
|---|---|---|---|
| 1 | Crear el proyecto Supabase (región sugerida `us-east-1`) | **Pendiente de confirmación** | No se creó nada en la cuenta. Las tres bases existentes (`miau-market`, `Red-Bibosi`, `Raking 100 bolivia`) no se han tocado. Al confirmar: crear el proyecto, aplicar `supabase/migrations/20261114000000_esquema_inicial.sql` y anotar URL y clave publicable en `src/js/config.js`. |
| 2 | Crear el proyecto Vercel enlazado al repositorio | **Pendiente de confirmación** | No se enlazó nada. Al confirmar: importar el repositorio en el equipo `jhoncitorc23-3787` como sitio estático, sin comando de build y con directorio raíz. |
| 3 | Acceso a nasa.gov | **Bloqueado por la red** | Las peticiones a `www.nasa.gov` devuelven **403** desde el proxy de la sesión (política de red). No se ha eludido el bloqueo. Consecuencia: Apolo y Artemis quedan como `pendiente` (ver sección 3). |
| 4 | Licencia del repositorio | **Pendiente de confirmación** | El README ya indica "Pendiente de definir por el equipo". No se añadió archivo `LICENSE`. |

## 2. Bloqueos técnicos que afectan a la verificación

| Bloqueo | Efecto | Cómo se resolverá |
|---|---|---|
| `cdn.jsdelivr.net` devuelve **403** desde el proxy de la sesión | `supabase-js` no puede cargarse aquí. El código lo carga solo cuando hay configuración, así que la app funciona sin él. | Comprobar la carga real en la preview de Vercel, con el proyecto ya configurado. |
| Sin proyecto Supabase | El criterio "una consulta anónima devuelve `fuentes`" y el criterio de la fase 1 contra la base real quedan **sin verificar**. | Tras la decisión 1, ejecutar `tests/db/restricciones.sql` contra la base de desarrollo. |
| Sin preview de Vercel | El criterio "la preview responde 200" de la fase 0 queda **sin verificar**. | Tras la decisión 2. |

## 3. Datos y contenido

- **Todos los datos de misiones están `pendiente`.** No se ha leído ninguna fuente primaria. No se ha escrito ninguna cifra de memoria.
- **Artemis II** usa fuentes secundarias (F-WTOP, F-NTD, F-BOEING). Se muestra como pendiente de verificación, sin cifra.
- **Artemis III** tiene fechas en conflicto entre fuentes: no se publica. Artemis III a V quedan fuera del MVP.
- **Apolo 1 a 17**: solo identificadores. Apolo 2 y 3 no tuvieron misión (según `docs/fuentes.md`) y no aparecen en la línea de tiempo.
- **Explicaciones de los eventos**: texto marcado como pendiente de verificación. La redacción con fuente primaria depende del acceso a nasa.gov (bloqueo 3). La tabla `eventos` no tiene columna de fuente; si se requiere citar por afirmación, hace falta una decisión de esquema.
- **Sistema solar**: los valores de radio, distancia y periodo se registran como pendientes. Son las únicas filas de la semilla sin fuente asociada.
- **Trayectorias de Apolo 11 y Artemis II**: esquema etiquetado "sin cifras", como pide el prompt.

## 4. Verificación pendiente

| Criterio | Estado |
|---|---|
| `node --test` de las pruebas unitarias | **Cumplido localmente** (21 pruebas) |
| Pruebas de restricciones y RLS (`tests/db/`) | **Cumplido en Postgres 16 local** con la migración aplicada y roles `anon`/`authenticated` creados. **No ejecutado** contra Supabase. |
| Preview de Vercel con Playwright | **Pendiente**: sin preview. Local: sin errores de consola, todas las rutas, sin desplazamiento horizontal a 390 px. |
| Coherencia `docs/fuentes.md` y tabla `fuentes` | **Cumplido** por `tests/unit/fuentes-coherencia.test.js` |
| CI | Añadido job de pruebas unitarias. **Pendiente de ejecución** en GitHub. |

## 5. Decisiones técnicas tomadas

- `package.json` mínimo, sin dependencias, solo para `"type": "module"` y el script `npm test`. Se justifica aquí porque el prompt no lo pide.
- `node --test tests/unit/` no acepta directorios en Node 22; se usa el patrón `tests/unit/*.test.js`.
- El simulador integra la quema en exactamente `n` pasos que terminan en `t_b`. La fase (quemando o balística) se pasa explícitamente a `derivadas`, no se deduce de `t`. Deducirla de `t` sesgaba la última etapa de RK4 (error de ~1e-4 en `v_b`), y la prueba lo detectó.
- `valor` se guarda como `text` para admitir texto y número.
- Las fuentes con la misma página en dos periodos (Starlust) se registran como dos IDs.
