# Astro-fuente

Simulador web de exploración espacial **verificable**: cada dato muestra su fuente, su fecha de consulta y su estado de verificación.

> Proyecto independiente, sin afiliación con la NASA ni con otras agencias o empresas mencionadas. Desarrollado para el **NASA Art Space Challenge**.

---

## Descripción

Astro-fuente reúne en una sola experiencia:

- **Visor del espacio:** sistema solar, galaxias cercanas y la Vía Láctea.
- **Misiones tripuladas:** trayectorias de Apolo 11 y Artemis II, con distancias, órbitas y aproximación a la Luna.
- **Simulador de vuelo:** diseño de un cohete con despegue y aterrizaje, con las fórmulas visibles para el usuario.
- **Panel de programas futuros:** planes públicos de Artemis III, IV y V, y de SpaceX (cohetes y Marte), con enfoque crítico basado en fuentes.
- **Entorno espacial actual:** noticias recientes y satélites (por ejemplo, Starlink y comunicaciones celulares desde satélite).

## Principios

| Principio | Qué significa en la práctica |
|---|---|
| **Verificabilidad** | Todo dato incluye fuente, fecha de consulta y estado (`verificado`, `pendiente`, `desactualizado`). |
| **Transparencia del cálculo** | Las fórmulas del simulador se muestran junto al resultado. |
| **Independencia** | El proyecto no está afiliado ni respaldado por la NASA. |
| **Separación de opinión y datos** | Las valoraciones críticas se identifican como tales y se apoyan en fuentes públicas. |

## Estado del proyecto

El proyecto está en **etapa temprana**: definido el alcance general, pendiente la primera versión (MVP) y la decisión sobre el reto principal del formulario de inscripción.

| Módulo | Estado |
|---|---|
| Alcance y documentación | En curso |
| Visor del sistema solar y la galaxia | Pendiente |
| Misiones Apolo 11 y Artemis II | Pendiente (datos por verificar) |
| Simulador de vuelo | Pendiente |
| Panel de programas futuros | Pendiente |
| Noticias y satélites | Pendiente |

El seguimiento de tareas se realiza en la pestaña **Issues** del repositorio.

## Documentación

- [`CONTRIBUTING.md`](CONTRIBUTING.md): cómo contribuir, convenciones de ramas, commits y revisión.
- [`docs/fuentes.md`](docs/fuentes.md): registro de fuentes y estado de cada dato.

## Estructura del repositorio

```text
.
├── .github/              Plantillas de issues y pull requests
├── docs/                 Documentación del proyecto y registro de fuentes
├── CONTRIBUTING.md       Guía de contribución
├── README.md             Este archivo
└── ...                   El código fuente se añadirá en fases posteriores
```

## Seguridad y datos sensibles

- No subir claves, tokens ni archivos `.env` al repositorio. Usa `.env.example` para documentar variables necesarias sin valores reales.
- Reportar vulnerabilidades o datos sensibles mediante un issue privado o contactando directamente a los responsables del proyecto.

## Licencia

Pendiente de definir por el equipo.
