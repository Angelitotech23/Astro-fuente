# Guía de contribución

Gracias por contribuir a Astro-fuente. Esta guía describe el flujo de trabajo, las convenciones y los criterios de revisión del proyecto.

## 1. Principio rector: datos verificables

Todo dato que se muestre en la aplicación debe registrarse en [`docs/fuentes.md`](docs/fuentes.md) con:

- **Valor** y unidad.
- **Fuente**: nombre de la organización o documento y enlace público.
- **Fecha de consulta** (formato `AAAA-MM-DD`).
- **Estado**: `verificado`, `pendiente` o `desactualizado`.

Un cambio que añade o modifica datos sin fuente registrada no se aprueba.

## 2. Flujo de trabajo

1. Abre o asigna un **issue** antes de empezar un cambio relevante.
2. Crea una rama desde `main` con el prefijo adecuado (ver abajo).
3. Realiza cambios pequeños y enfocados.
4. Abre un **pull request** hacia `main` usando la plantilla del repositorio.
5. Espera la revisión de al menos una persona antes de fusionar.
6. Fusiona con **squash and merge** para mantener un historial limpio.

### Nombres de ramas

| Prefijo | Uso |
|---|---|
| `feat/` | Nueva funcionalidad o módulo |
| `fix/` | Corrección de errores |
| `docs/` | Cambios solo de documentación |
| `data/` | Añadir o actualizar datos y fuentes |
| `chore/` | Mantenimiento, configuración o herramientas |

Ejemplo: `data/apollo-11-trayectoria`.

## 3. Convención de commits

Se usa [Conventional Commits](https://www.conventionalcommits.org/es/v1.0.0/):

```text
<tipo>(<ámbito opcional>): <descripción breve en modo imperativo>
```

Tipos permitidos: `feat`, `fix`, `docs`, `data`, `refactor`, `test`, `chore`.

Ejemplos:

```text
docs(fuentes): registrar fuente de distancia Tierra-Luna
data(artemis-ii): actualizar fecha de la última revisión de la misión
fix(simulador): corregir unidad de velocidad de escape
```

## 4. Estilo de código

- Codificación **UTF-8**, finales de línea **LF** y sangría de **2 espacios** (ver `.editorconfig`).
- Nombres de variables, funciones y archivos en **inglés**; textos visibles para el usuario y documentación en **español**.
- Cada fórmula del simulador debe incluir un comentario o una nota visible que indique su origen.
- No se añaden dependencias nuevas sin justificarlas en el pull request.

## 5. Seguridad

- Nunca subas credenciales, tokens, claves privadas ni archivos `.env`. El `.gitignore` los excluye, pero la responsabilidad de revisar antes de confirmar cambios es de quien contribuye.
- Si detectas un secreto expuesto, avisa de inmediato al equipo y considera la clave comprometida; no basta con borrarla del historial.

## 6. Revisión de pull requests

Una revisión se considera completa cuando:

- [ ] El cambio cumple el alcance del issue asociado.
- [ ] Los datos nuevos o modificados tienen fuente, fecha y estado en `docs/fuentes.md`.
- [ ] No hay credenciales ni archivos sensibles en el diff.
- [ ] La documentación afectada está actualizada.
- [ ] La descripción del pull request explica qué cambia y cómo se verificó.

## 7. Reportar problemas

Usa las plantillas de issues disponibles en la pestaña **Issues**. Para problemas de seguridad, no abras un issue público; contacta directamente al equipo.
