# Despliegue (pendiente de ejecutar)

Astro-fuente es un sitio estático: no hay comando de build. Este documento deja listo el procedimiento; **no se ha creado ni enlazado ningún proyecto externo** en esta rama.

## 1. Vercel (sitio estático)

Cuando el equipo confirme:

1. Importar el repositorio `Angelitotech23/Astro-fuente` en el equipo Vercel.
2. Framework Preset: **Other**.
3. Build Command: vacío.
4. Output Directory: vacío (raíz del repo; `index.html` en la raíz).
5. Install Command: vacío (o `npm ci` solo si se quieren correr tests en CI de Vercel; no es necesario para servir).
6. Root Directory: `.`

El archivo [`vercel.json`](../vercel.json) fija cabeceras básicas y reescritura suave hacia `index.html` para rutas inexistentes (la app navega por hash, así que la raíz basta).

Criterio de verificación posterior: la preview responde **200** en `/` y carga `#/director` sin errores de consola.

## 2. Supabase (opcional para el catálogo)

1. Crear un proyecto nuevo (no reutilizar bases de otros productos).
2. Aplicar `supabase/migrations/20261114000000_esquema_inicial.sql`.
3. Copiar URL y clave **publicable** a `src/js/config.js` (nunca `service_role`).
4. Ejecutar `tests/db/restricciones.sql` contra la base de desarrollo.

Sin Supabase la app funciona: muestra aviso y datos pendientes.

## 3. Variables

Ver [`.env.example`](../.env.example). En producción estática los valores públicos viven en `src/js/config.js`.

## 4. Comprobaciones locales antes de desplegar

```bash
npm test
python3 -m http.server 8080
# Abrir http://localhost:8080/#/director
```

## 5. Checklist del envío Space Apps

- [ ] Challenge seleccionado: **Space Mission Design Game**
- [ ] Demo en inglés (video ≤30 s con subtítulos EN, o ≤7 slides)
- [ ] References: citar Horizons, modelo didáctico, código, guías Space Apps
- [ ] Enlace al repo y a la preview de Vercel
- [ ] Aviso de independencia respecto a la NASA visible en la app
