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

El MVP está implementado en local. Pendientes: crear el proyecto de Supabase, enlazar Vercel y el acceso a fuentes primarias de NASA (ver `docs/decisiones.md`).

| Módulo | Estado |
|---|---|
| Alcance y documentación | En curso |
| Visor del sistema solar | MVP: 2D, datos pendientes de verificación |
| Histórico Apolo 1 a 17 y trayectorias de Apolo 11 y Artemis II | MVP: fechas pendientes, esquema sin cifras |
| Simulador de vuelo | MVP: fase única, modelo simplificado |
| Galaxia y Vía Láctea en 3D | Fuera del MVP |
| Panel de programas futuros | Pendiente |
| Noticias y satélites | Pendiente |

El seguimiento de tareas se realiza en la pestaña **Issues** del repositorio.

## Documentación

- [`docs/contexto-proyecto.md`](docs/contexto-proyecto.md): contexto, alcance, módulos, decisiones y riesgos del proyecto.
- [`CONTRIBUTING.md`](CONTRIBUTING.md): cómo contribuir, convenciones de ramas, commits y revisión.
- [`CHANGELOG.md`](CHANGELOG.md): historial de cambios por versión.
- [`.env.example`](.env.example): variables de entorno del proyecto (actualmente ninguna).
- [`docs/fuentes.md`](docs/fuentes.md): registro de fuentes y estado de cada dato.

## Ejecutar en local

No hay paso de compilación. Sirve la carpeta con cualquier servidor estático, por ejemplo:

```bash
python3 -m http.server 8080
```

Abre `http://localhost:8080`. Sin configurar la base de datos, la aplicación funciona y muestra los datos como pendientes de verificación.

Pruebas unitarias (requieren Node 18 o superior, sin dependencias):

```bash
npm test
```

## Estructura del repositorio

```text
.
├── index.html            Punto de entrada (sin build)
├── src/
│   ├── css/app.css       Estilos
│   ├── js/app.js         Navegación por hash y carga inicial
│   ├── js/config.js      URL y clave publicable (públicas por diseño)
│   ├── js/datos/         Acceso de solo lectura a Supabase
│   ├── js/componentes/   Componente de verificabilidad (dato)
│   ├── js/simulador/     Modelo físico, integradores y simulación
│   └── js/vistas/        Vistas: sistema solar, histórico, misiones, fuentes
├── supabase/migrations/  Esquema, restricciones, RLS y semillas
├── tests/
│   ├── unit/             Pruebas de Node (npm test)
│   └── db/               Pruebas de restricciones y RLS en Postgres
├── docs/                 Contexto, fuentes, decisiones y bloqueos
├── .github/              Plantillas de issues y pull requests
├── CONTRIBUTING.md       Guía de contribución
└── README.md             Este archivo
```

## Seguridad y datos sensibles

- No subir claves, tokens ni archivos `.env` al repositorio. Usa `.env.example` para documentar variables necesarias sin valores reales.
- Reportar vulnerabilidades o datos sensibles mediante un issue privado o contactando directamente a los responsables del proyecto.

## Licencia

Pendiente de definir por el equipo.
