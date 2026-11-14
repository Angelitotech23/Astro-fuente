# Contexto del proyecto: Astro-fuente

| Campo | Valor |
|---|---|
| Versión del documento | 1.0 |
| Fecha de elaboración | 2026-11-14 |
| Estado del proyecto | Etapa temprana: alcance definido en líneas generales, sin código del simulador |
| Responsable del documento | Equipo del proyecto |
| Documentos relacionados | [`README.md`](../README.md), [`CONTRIBUTING.md`](../CONTRIBUTING.md), [`docs/fuentes.md`](fuentes.md) |

> **Convención de este documento.** Cada afirmación proviene de una de tres fuentes: (a) las notas de la conversación con el responsable del proyecto, (b) el README del repositorio o (c) una propuesta del equipo. Las propuestas se marcan como **[Propuesta]** y las decisiones pendientes como **[Pendiente]**. Ningún dato factual de misiones se considera válido hasta tener su entrada verificada en [`fuentes.md`](fuentes.md).

---

## 1. Resumen ejecutivo

Astro-fuente es un simulador web de exploración espacial cuyo rasgo distintivo es la **verificabilidad**: cada dato que se muestra indica su fuente, su fecha de consulta y su estado. La aplicación combina cuatro experiencias:

1. **Un visor del espacio** que recorre el sistema solar, las galaxias cercanas y la Vía Láctea.
2. **Un visor de misiones** con las trayectorias de Apolo 11 y Artemis II, incluyendo distancias, órbitas y aproximación a la Luna.
3. **Un simulador de vuelo** en el que el usuario diseña un cohete y lo lleva a despegar y aterrizar, con las fórmulas visibles.
4. **Un panel de programas futuros y actuales** con los planes públicos de Artemis III, IV y V, y de SpaceX (cohetes, Starlink, comunicaciones desde satélite y Marte), con un enfoque crítico apoyado en fuentes.

El proyecto se presenta al **NASA Art Space Challenge**. Es independiente y no tiene afiliación con la NASA ni con ninguna otra organización mencionada.

---

## 2. Antecedentes y motivación

- **Por qué existe.** Gran parte de la información sobre exploración espacial está dispersa entre comunicados, documentos técnicos y notas de prensa, y es difícil saber de dónde viene cada cifra y si sigue vigente. Astro-fuente busca reunir esa información en una sola experiencia y dejar visible su procedencia.
- **Por qué ahora.** El entorno espacial cambia rápido: nuevas misiones, planes de lanzamiento que se reprograman, constelaciones de satélites en crecimiento y noticias recientes como el cometa interestelar 3I/ATLAS. Un producto que no declara la fecha de sus datos se vuelve engañoso con el tiempo.
- **Contexto del concurso.** El reto consiste en diseñar una experiencia espacial creativa. El proyecto responde a dos de los retos del concurso (ver sección 11).

---

## 3. Objetivos y criterios de éxito

| # | Objetivo | Criterio de éxito verificable |
|---|---|---|
| O1 | Visualizar el espacio en una sola experiencia | El usuario puede navegar sistema solar, galaxias cercanas y Vía Láctea desde una misma página. |
| O2 | Mostrar misiones reales con sus trayectorias | Apolo 11 y Artemis II se muestran con distancias y tiempos, y cada cifra tiene entrada en `fuentes.md`. |
| O3 | Permitir jugar con la física del vuelo | El usuario puede diseñar un cohete, lanzarlo y ver el resultado; cada fórmula aparece en pantalla. |
| O4 | Explicar las misiones | **[Pendiente]** Definir si la explicación es textual curada en la primera versión o una IA en una fase posterior. |
| O5 | Cubrir el entorno espacial actual | Noticias y satélites muestran fecha de publicación y fuente. |
| O6 | Separar datos de opinión | Toda valoración crítica sobre planes de terceros se etiqueta como opinión y cita fuentes públicas. |

---

## 4. Alcance

### 4.1 Incluido en el alcance general

| Componente | Descripción |
|---|---|
| Visor del sistema solar y la galaxia | Sistema solar, galaxias cercanas y Vía Láctea. |
| Misiones pasadas (histórico) | Programa Apolo completo (Apolo 1 a 17) y Artemis I y II. Visor detallado con trayectoria real para Apolo 11 y Artemis II. Registro de cada misión en [`fuentes.md`](fuentes.md). |
| Misiones futuras | Artemis III, IV y V, según los planes públicos de NASA. Estado al 2026-11-14 en [`fuentes.md`](fuentes.md) (datos secundarios, pendientes de verificación). |
| Plan de SpaceX | Cohetes y Marte, con enfoque crítico. |
| Simulador de vuelo | Construcción de cohete, despegue y aterrizaje. |
| Noticias y satélites | Eventos recientes y satélites (Starlink, comunicaciones desde satélite). |

### 4.2 Propuesta de alcance para la primera versión (MVP)

**[Propuesta]** Para la primera versión, entrar lo que permita demostrar el principio de verificabilidad con el menor riesgo:

- Visor del sistema solar con datos básicos de cada cuerpo.
- Visor de Apolo 11 y Artemis II con una cantidad acotada de datos, todos verificados.
- Registro de fuentes visible desde cada dato (fuente, fecha, estado).
- Simulador de vuelo **simplificado**: cohete de masa y propulsión configurables, con una sola fase y fórmulas visibles.

### 4.3 Fuera del MVP (fases posteriores)

- Visor de la Vía Láctea y de galaxias cercanas con navegación 3D completa.
- Panel de programas futuros con escenarios hipotéticos.
- Enfoque crítico sobre los planes de SpaceX.
- Noticias y satélites en tiempo real.
- Explicación de misiones mediante IA.
- Simulador de aterrizaje con física detallada.

### 4.4 Pendientes de alcance

- **[Pendiente]** Si la IA explicativa entra en la primera versión o queda para una fase posterior.
- **[Pendiente]** Si el visor de misiones futuras muestra solo planes públicos o también escenarios hipotéticos. **[Propuesta]** Solo planes públicos, con etiqueta de fecha de consulta.
- **[Pendiente]** Cómo presentar el enfoque crítico sobre SpaceX sin confundir opinión con datos. **[Propuesta]** Separar visualmente "dato" (con fuente) de "análisis" (con autor, fecha y fuentes que lo sustentan).

---

## 5. Usuarios y casos de uso

| Perfil | Necesidad | Caso de uso principal |
|---|---|---|
| Público general interesado en el espacio | Entender una misión sin leer documentos técnicos | Recorrer la trayectoria de Apolo 11 y leer su significado. |
| Estudiante o docente | Aprender física orbital de forma práctica | Diseñar un cohete en el simulador y comparar resultados. |
| Jurado del concurso | Evaluar creatividad, rigor y uso de datos | Revisar que cada cifra tenga fuente y fecha. |
| Equipo de desarrollo | Mantener los datos al día | Actualizar una entrada en `fuentes.md` y ver el cambio reflejado. |

---

## 6. Módulos funcionales

Cada módulo define qué hace, qué datos necesita y cuándo se considera terminado.

### 6.1 Visor del sistema solar y la galaxia

- **Qué hace.** Muestra los cuerpos del sistema solar, las galaxias cercanas y la Vía Láctea, con navegación por escala.
- **Datos necesarios.** Radio medio, distancia media al Sol, periodo orbital, número de lunas y datos equivalentes para galaxias.
- **Criterios de aceptación.** Cada cuerpo tiene al menos una fuente registrada; las escalas están explicadas; la navegación funciona en escritorio y en móvil.

### 6.2 Visor de misiones (Apolo 11 y Artemis II)

- **Qué hace.** Muestra la trayectoria de cada misión, con sus eventos clave (despegue, inserción orbital, aproximación a la Luna, retorno) y la distancia recorrida.
- **Datos necesarios.** Fechas de los eventos, distancias y velocidades en cada fase, tripulación pública y fuente oficial.
- **Criterios de aceptación.** Cada evento tiene fecha y fuente; las cifras indican si son medidas, calculadas o estimadas.
- **Riesgo principal.** Mezclar datos de la misión con cálculos del equipo. Cualquier cálculo debe marcarse como tal.

### 6.3 Misiones futuras

- **Qué hace.** Lista Artemis III, IV y V con su estado de planeación.
- **Datos necesarios.** Objetivo declarado, fecha prevista (con la advertencia de que cambia), agencia y fuente.
- **Criterios de aceptación.** Cada fecha prevista muestra la fecha de consulta y la fuente; el texto aclara que las fechas son planes y pueden cambiar.

### 6.4 Plan de SpaceX (fase posterior)

- **Qué hace.** Resume los planes públicos de cohetes, Starlink, comunicaciones desde satélite y Marte.
- **Criterios de aceptación.** Cada afirmación es dato con fuente o análisis etiquetado. No se presentan promesas de la empresa como hechos consumados.

### 6.5 Simulador de vuelo

- **Qué hace.** El usuario configura un cohete (masa seca, masa de propelente, empuje, velocidad de escape) y simula despegue y aterrizaje. El resultado muestra altura, velocidad y Δv.
- **Criterios de aceptación.** Cada fórmula está visible junto al resultado; las unidades son explícitas; las simplificaciones están listadas.
- **Detalle técnico.** Ver sección 8.

### 6.6 Noticias y satélites (fase posterior)

- **Qué hace.** Muestra eventos recientes (por ejemplo, el cometa 3I/ATLAS) y el estado de satélites relevantes.
- **Criterios de aceptación.** Cada noticia muestra fecha de publicación y fuente primaria; los datos orbitales indican fecha de consulta, porque cambian con frecuencia.

---

## 7. Verificabilidad y modelo de datos

La verificabilidad es el principio que más pesa en el diseño. Para cumplirlo, **cada dato mostrado en la aplicación debe tener un registro** en [`docs/fuentes.md`](fuentes.md) con estos campos:

| Campo | Descripción | Ejemplo de formato |
|---|---|---|
| ID | Identificador único del dato | `APOLO11-01` |
| Dato | Qué describe el valor | Distancia media Tierra-Luna |
| Valor y unidad | Cifra con su unidad | (completar con la fuente) |
| Tipo | `medido`, `oficial`, `calculado` o `estimado` | `oficial` |
| Fuente | Organización, documento y enlace | Nombre del documento y URL |
| Fecha de consulta | Día de verificación | `AAAA-MM-DD` |
| Estado | `verificado`, `pendiente` o `desactualizado` | `verificado` |

**Reglas de publicación:**

1. Un dato `pendiente` puede existir en el repositorio, pero no se publica como hecho en la aplicación.
2. Un dato `desactualizado` debe mostrar un aviso visible al usuario.
3. Un dato `calculado` debe mostrar la fórmula o el método usado.
4. Las fuentes preferidas son sitios oficiales de agencias, documentos técnicos y publicaciones revisadas por pares. Los artículos de prensa se usan solo como respaldo.

---

## 8. Simulador de vuelo: física y supuestos

### 8.1 Fórmulas propuestas

**[Propuesta]** Para la primera versión, usar modelos simples y explicables:

- **Ecuación del cohete de Tsiolkovsky:** `Δv = v_e · ln(m_0 / m_f)`, donde `v_e` es la velocidad efectiva de escape, `m_0` la masa inicial y `m_f` la masa final.
- **Aceleración neta en vertical:** `a = (F_empuje − m·g) / m`, con `g` aproximada como constante cerca de la superficie.
- **Empuje:** `F = ṁ · v_e`, donde `ṁ` es el gasto de propelente.

### 8.2 Supuestos y limitaciones

Cada simplificación debe listarse en la interfaz. Propuesta inicial:

- Gravedad constante (sin variación con la altitud).
- Sin resistencia atmosférica en la primera versión, o con un modelo de arrastre simple y declarado.
- Una sola fase de propulsión.
- Sin control de actitud ni maniobras complejas.

### 8.3 Validación

Antes de publicar el simulador, comparar sus resultados con un caso de referencia documentado (por ejemplo, un cálculo de Δv publicado en una fuente de física orbital) y registrar esa comparación en `fuentes.md`.

---

## 9. Arquitectura y despliegue

**[Propuesta]** Para la primera versión, una aplicación web estática sin backend:

- Código del cliente en HTML, CSS y JavaScript, sin dependencias innecesarias.
- Datos de misiones y fuentes en archivos versionados (JSON o Markdown), generados a partir de `fuentes.md` cuando sea posible.
- Sin credenciales ni servicios externos en la primera versión, lo que reduce el riesgo de exponer secretos.
- Despliegue en una plataforma de hosting estático (**[Pendiente]** confirmar la plataforma; el equipo ya tiene un proyecto conectado en Vercel).

**[Pendiente]** Definir el stack de visualización 3D (por ejemplo, Three.js) cuando se decida el alcance del visor de galaxias.

---

## 10. Roadmap por fases

No se asignan fechas comprometidas hasta cerrar el alcance del MVP.

| Fase | Entregable | Dependencia |
|---|---|---|
| 0. Preparación | Repositorio, plantillas, documentación de contexto, decisión de reto | Esta versión del documento |
| 1. Datos base | Registro de fuentes del MVP completo y verificado | Lista definitiva de misiones y fuentes |
| 2. MVP | Visor del sistema solar, visor de Apolo 11 y Artemis II, simulador simplificado | Fase 1 |
| 3. Expansión | Misiones futuras, galaxias y Vía Láctea | Fase 2 y decisión de stack 3D |
| 4. Análisis | Plan de SpaceX con enfoque crítico, noticias y satélites | Criterios de análisis definidos |
| 5. Explicaciones | Explicación de misiones (curada o con IA) | Decisión de O4 |

---

## 11. Retos del concurso y decisión pendiente

El proyecto cubre dos retos del NASA Art Space Challenge:

1. **Diseño de misiones espaciales.** Corresponde al visor de misiones, a la planeación de Artemis y al plan de SpaceX.
2. **Simulador de puesto avanzado.** Corresponde al simulador de vuelo y a la experiencia de construcción de cohetes.

El formulario de equipo **solo permite registrar un reto**. **[Pendiente]** Decidir cuál se registra como principal antes de la inscripción.

**[Propuesta]** Registrar como principal el **diseño de misiones**, porque el visor de Apolo 11 y Artemis II, la verificabilidad de los datos y el panel de programas futuros son el núcleo del proyecto. El simulador queda como componente de apoyo y como evidencia de la parte interactiva. Esta recomendación debe confirmarse con el equipo.

---

## 12. Riesgos y mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| Datos desactualizados (misiones futuras, planes de SpaceX) | Alta | Alto | Campo de fecha de consulta visible, aviso de desactualización y revisión periódica. |
| Afirmaciones sin fuente | Media | Alto | Regla de publicación: sin fuente verificada, no se publica como hecho. |
| Confundir opinión con datos en el enfoque crítico | Media | Alto | Separación visual y etiqueta de análisis con fuentes. |
| Simulador con física demasiado simplificada | Media | Medio | Declarar supuestos en la interfaz y validar contra un caso de referencia. |
| Alcance excesivo para el plazo del concurso | Alta | Alto | Definir MVP estricto y dejar el resto como fases posteriores. |
| Exposición de credenciales en un repositorio público | Baja | Alto | `.gitignore` configurado, sin `.env` y revisión en cada pull request. |
| Afiliación implícita con la NASA | Baja | Medio | Aviso de independencia en README y en la aplicación. |

---

## 13. Registro de decisiones

| ID | Decisión | Estado | Fecha |
|---|---|---|---|
| D-01 | El proyecto es independiente, sin afiliación con la NASA | Tomada | 2026-11-14 |
| D-02 | Cada dato muestra fuente, fecha de consulta y estado | Tomada | 2026-11-14 |
| D-03 | La primera versión es una aplicación web estática sin backend | Propuesta | 2026-11-14 |
| D-04 | Reto principal del formulario de inscripción | Pendiente | — |
| D-05 | Incluir o no la IA explicativa en la primera versión | Pendiente | — |
| D-06 | Plataforma de hosting para el despliegue | Pendiente | — |
| D-07 | Licencia del repositorio | Pendiente | — |
| D-08 | Stack de visualización 3D | Pendiente | — |

---

## 14. Preguntas abiertas

1. ¿Cuál es la lista definitiva de misiones que entran en el MVP?
2. ¿Quién es responsable de mantener actualizados los datos y con qué frecuencia?
3. ¿El simulador debe permitir guardar y comparar diseños de cohete?
4. ¿Qué nivel de detalle técnico espera el público objetivo?
5. ¿Quiénes integran el equipo y qué responsabilidades tiene cada persona? (no registrado)

---

## 15. Glosario

| Término | Definición |
|---|---|
| **Δv (delta-v)** | Cambio de velocidad que una nave puede lograr con su propulsión. |
| **Ecuación de Tsiolkovsky** | Relación entre Δv, velocidad de escape y la razón de masas de un cohete. |
| **Artemis** | Programa de la NASA para regresar astronautas a la Luna. |
| **Apolo 11** | Primera misión tripulada que llegó a la superficie lunar (1969). |
| **Starlink** | Constelación de satélites de comunicaciones de SpaceX. |
| **Verificable** | Que cada dato se puede rastrear hasta una fuente con fecha y estado. |

---

## 16. Referencias

Las referencias se registran en [`docs/fuentes.md`](fuentes.md) con su fecha de consulta. **[Pendiente]** Completar la lista inicial de fuentes primarias para cada misión y para cada dato del MVP.
