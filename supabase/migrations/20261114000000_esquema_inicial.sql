-- Esquema inicial de Astro-fuente.
--
-- Principio: las reglas de verificabilidad son restricciones de base de datos,
-- no solo validaciones de la interfaz. Ver docs/fuentes.md y docs/decisiones.md.
--
-- Acceso: lectura pública (rol anon) en todas las tablas. Ningún rol puede
-- escribir desde el cliente: no hay políticas de escritura ni privilegios de
-- escritura para anon ni authenticated.

-- ---------------------------------------------------------------------------
-- Tablas
-- ---------------------------------------------------------------------------

CREATE TABLE public.fuentes (
  id      text PRIMARY KEY CHECK (id ~ '^F-[A-Z0-9-]+$'),
  nombre  text NOT NULL CHECK (length(trim(nombre)) > 0),
  url     text NOT NULL CHECK (url ~ '^https://'),
  clase   text NOT NULL CHECK (clase IN ('primaria', 'secundaria')),
  notas   text
);

CREATE TABLE public.misiones (
  id     text PRIMARY KEY CHECK (id ~ '^[a-z0-9-]+$'),
  nombre text NOT NULL CHECK (length(trim(nombre)) > 0),
  clase  text NOT NULL CHECK (clase IN ('historica', 'futura')),
  orden  integer NOT NULL UNIQUE
);

CREATE TABLE public.datos (
  id             text PRIMARY KEY CHECK (id ~ '^[A-Z0-9-]+$'),
  etiqueta       text NOT NULL CHECK (length(trim(etiqueta)) > 0),
  valor          text,
  unidad         text NOT NULL CHECK (length(trim(unidad)) > 0),
  tipo           text NOT NULL CHECK (tipo IN ('medido', 'oficial', 'calculado', 'estimado')),
  estado         text NOT NULL CHECK (estado IN ('verificado', 'pendiente', 'desactualizado')),
  fuente_id      text REFERENCES public.fuentes (id),
  fecha_consulta date,
  metodo         text,
  supuestos      text,
  -- valor es nulo si y solo si el estado es pendiente.
  CONSTRAINT datos_valor_solo_si_no_pendiente
    CHECK ((valor IS NULL) = (estado = 'pendiente')),
  -- Un dato verificado exige fuente y fecha de consulta.
  CONSTRAINT datos_verificado_exige_fuente
    CHECK (estado <> 'verificado' OR (fuente_id IS NOT NULL AND fecha_consulta IS NOT NULL)),
  -- Un dato calculado exige método; uno estimado, supuestos.
  CONSTRAINT datos_calculado_exige_metodo
    CHECK (tipo <> 'calculado' OR (metodo IS NOT NULL AND length(trim(metodo)) > 0)),
  CONSTRAINT datos_estimado_exige_supuestos
    CHECK (tipo <> 'estimado' OR (supuestos IS NOT NULL AND length(trim(supuestos)) > 0)),
  -- La fecha de consulta no puede estar en el futuro.
  CONSTRAINT datos_fecha_consulta_no_futura
    CHECK (fecha_consulta IS NULL OR fecha_consulta <= current_date)
);

CREATE INDEX datos_fuente_id_idx ON public.datos (fuente_id);

CREATE TABLE public.eventos (
  id                   text PRIMARY KEY CHECK (id ~ '^[a-z0-9-]+$'),
  mision_id            text NOT NULL REFERENCES public.misiones (id) ON DELETE CASCADE,
  nombre               text NOT NULL CHECK (length(trim(nombre)) > 0),
  orden                integer NOT NULL,
  tiempo_met_dato_id   text REFERENCES public.datos (id),
  coordenadas_dato_id  text REFERENCES public.datos (id),
  explicacion          text NOT NULL,
  CONSTRAINT eventos_orden_unico_por_mision UNIQUE (mision_id, orden)
);

CREATE INDEX eventos_tiempo_met_idx ON public.eventos (tiempo_met_dato_id);
CREATE INDEX eventos_coordenadas_idx ON public.eventos (coordenadas_dato_id);

-- ---------------------------------------------------------------------------
-- Seguridad: RLS y privilegios
-- ---------------------------------------------------------------------------

ALTER TABLE public.fuentes  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.misiones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.datos    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eventos  ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.fuentes, public.misiones, public.datos, public.eventos
  FROM anon, authenticated;

GRANT SELECT ON public.fuentes, public.misiones, public.datos, public.eventos
  TO anon;

CREATE POLICY fuentes_lectura_publica  ON public.fuentes  FOR SELECT TO anon USING (true);
CREATE POLICY misiones_lectura_publica ON public.misiones FOR SELECT TO anon USING (true);
CREATE POLICY datos_lectura_publica    ON public.datos    FOR SELECT TO anon USING (true);
CREATE POLICY eventos_lectura_publica  ON public.eventos  FOR SELECT TO anon USING (true);

-- ---------------------------------------------------------------------------
-- Semilla: fuentes (copia de docs/fuentes.md, sección "Catálogo de fuentes")
-- Cualquier cambio aquí debe reflejarse en ese documento en la misma PR.
-- ---------------------------------------------------------------------------

INSERT INTO public.fuentes (id, nombre, url, clase, notas) VALUES
  ('F-NASA-HO', 'NASA History Office', 'https://www.nasa.gov/history/', 'primaria', 'No consultada: acceso bloqueado por la política de red del 2026-11-14. Pendiente de lectura.'),
  ('F-WTOP', 'WTOP', 'https://wtop.com/national/2026/04/artemis-iis-grand-moon-finale-is-almost-here-with-a-pacific-splashdown-to-cap-nasas-lunar-comeback/', 'secundaria', 'Medio de noticias. Solo para datos pendientes de verificación.'),
  ('F-NTD', 'NTD', 'https://www.ntd.com/artemis-ii-mission-ends-with-splashdown-off-san-diego_1137976.html', 'secundaria', 'Medio de noticias. Solo para datos pendientes de verificación.'),
  ('F-BOEING', 'Boeing', 'https://www.boeing.com/features/2026/04/artemis-ii-crew-back-on-earth-after-historic-lunar-flyby', 'secundaria', 'Contratista de NASA, no es fuente primaria de la agencia.'),
  ('F-SPO', 'SpacePolicyOnline', 'https://spacepolicyonline.com/news/nasa-is-full-steam-ahead-on-artemis-iii-iv-and-v/', 'secundaria', 'Fechas de Artemis III a V. Hay conflicto entre fuentes sobre Artemis III.'),
  ('F-STARLUST-A', 'Starlust (Artemis III)', 'https://starlust.org/nas-as-artemis-iii-new-date-goal-and-everything-else-you-need-to-know/', 'secundaria', 'Fecha de Artemis III. Conflicto con otras fuentes.'),
  ('F-STARLUST-B', 'Starlust (Artemis IV y V)', 'https://starlust.org/heres-what-nasa-is-planning-for-artemis-iv-and-v-now-that-the-roadmap-to-the-moon-has-been-revised/', 'secundaria', 'Previsiones de Artemis IV y V.'),
  ('F-IFS', 'IFLScience', 'https://www.iflscience.com/artemis-iii-has-already-been-pushed-back-to-late-2027-just-2-months-after-nasa-announced-ambitious-new-moon-plan-83377', 'secundaria', 'Indica finales de 2027 para Artemis III. Conflicto con otras fuentes.');

-- ---------------------------------------------------------------------------
-- Semilla: misiones (Apolo 1 a 17 sin 2 ni 3, que según docs/fuentes.md no existieron; Artemis II)
-- ---------------------------------------------------------------------------

INSERT INTO public.misiones (id, nombre, clase, orden) VALUES
  ('apolo-01', 'Apolo 1', 'historica', 1),
  ('apolo-04', 'Apolo 4', 'historica', 4),
  ('apolo-05', 'Apolo 5', 'historica', 5),
  ('apolo-06', 'Apolo 6', 'historica', 6),
  ('apolo-07', 'Apolo 7', 'historica', 7),
  ('apolo-08', 'Apolo 8', 'historica', 8),
  ('apolo-09', 'Apolo 9', 'historica', 9),
  ('apolo-10', 'Apolo 10', 'historica', 10),
  ('apolo-11', 'Apolo 11', 'historica', 11),
  ('apolo-12', 'Apolo 12', 'historica', 12),
  ('apolo-13', 'Apolo 13', 'historica', 13),
  ('apolo-14', 'Apolo 14', 'historica', 14),
  ('apolo-15', 'Apolo 15', 'historica', 15),
  ('apolo-16', 'Apolo 16', 'historica', 16),
  ('apolo-17', 'Apolo 17', 'historica', 17),
  ('artemis-ii', 'Artemis II', 'historica', 18);

-- ---------------------------------------------------------------------------
-- Semilla: datos. Todos pendientes: sin cifra hasta leer la fuente primaria.
-- ---------------------------------------------------------------------------

INSERT INTO public.datos (id, etiqueta, valor, unidad, tipo, estado, fuente_id, fecha_consulta) VALUES
  ('APOLO-01-LANZ', 'Fecha de lanzamiento', NULL, 'fecha', 'oficial', 'pendiente', NULL, NULL),
  ('APOLO-04-LANZ', 'Fecha de lanzamiento', NULL, 'fecha', 'oficial', 'pendiente', NULL, NULL),
  ('APOLO-05-LANZ', 'Fecha de lanzamiento', NULL, 'fecha', 'oficial', 'pendiente', NULL, NULL),
  ('APOLO-06-LANZ', 'Fecha de lanzamiento', NULL, 'fecha', 'oficial', 'pendiente', NULL, NULL),
  ('APOLO-07-LANZ', 'Fecha de lanzamiento', NULL, 'fecha', 'oficial', 'pendiente', NULL, NULL),
  ('APOLO-08-LANZ', 'Fecha de lanzamiento', NULL, 'fecha', 'oficial', 'pendiente', NULL, NULL),
  ('APOLO-09-LANZ', 'Fecha de lanzamiento', NULL, 'fecha', 'oficial', 'pendiente', NULL, NULL),
  ('APOLO-10-LANZ', 'Fecha de lanzamiento', NULL, 'fecha', 'oficial', 'pendiente', NULL, NULL),
  ('APOLO-11-LANZ', 'Fecha de lanzamiento', NULL, 'fecha', 'oficial', 'pendiente', NULL, NULL),
  ('APOLO-12-LANZ', 'Fecha de lanzamiento', NULL, 'fecha', 'oficial', 'pendiente', NULL, NULL),
  ('APOLO-13-LANZ', 'Fecha de lanzamiento', NULL, 'fecha', 'oficial', 'pendiente', NULL, NULL),
  ('APOLO-14-LANZ', 'Fecha de lanzamiento', NULL, 'fecha', 'oficial', 'pendiente', NULL, NULL),
  ('APOLO-15-LANZ', 'Fecha de lanzamiento', NULL, 'fecha', 'oficial', 'pendiente', NULL, NULL),
  ('APOLO-16-LANZ', 'Fecha de lanzamiento', NULL, 'fecha', 'oficial', 'pendiente', NULL, NULL),
  ('APOLO-17-LANZ', 'Fecha de lanzamiento', NULL, 'fecha', 'oficial', 'pendiente', NULL, NULL),
  ('ARTEMIS-II-LANZ', 'Fecha de lanzamiento', NULL, 'fecha', 'oficial', 'pendiente', 'F-WTOP', '2026-11-14'),
  ('ARTEMIS-II-AMERIZAJE', 'Fecha de amerizaje', NULL, 'fecha', 'oficial', 'pendiente', 'F-NTD', '2026-11-14'),
  ('SS-MERCURIO-RADIO', 'Radio medio', NULL, 'km', 'oficial', 'pendiente', NULL, NULL),
  ('SS-MERCURIO-DIST', 'Distancia media al Sol', NULL, 'UA', 'oficial', 'pendiente', NULL, NULL),
  ('SS-MERCURIO-PERIODO', 'Periodo orbital', NULL, 'días', 'oficial', 'pendiente', NULL, NULL),
  ('SS-VENUS-RADIO', 'Radio medio', NULL, 'km', 'oficial', 'pendiente', NULL, NULL),
  ('SS-VENUS-DIST', 'Distancia media al Sol', NULL, 'UA', 'oficial', 'pendiente', NULL, NULL),
  ('SS-VENUS-PERIODO', 'Periodo orbital', NULL, 'días', 'oficial', 'pendiente', NULL, NULL),
  ('SS-TIERRA-RADIO', 'Radio medio', NULL, 'km', 'oficial', 'pendiente', NULL, NULL),
  ('SS-TIERRA-DIST', 'Distancia media al Sol', NULL, 'UA', 'oficial', 'pendiente', NULL, NULL),
  ('SS-TIERRA-PERIODO', 'Periodo orbital', NULL, 'días', 'oficial', 'pendiente', NULL, NULL),
  ('SS-MARTE-RADIO', 'Radio medio', NULL, 'km', 'oficial', 'pendiente', NULL, NULL),
  ('SS-MARTE-DIST', 'Distancia media al Sol', NULL, 'UA', 'oficial', 'pendiente', NULL, NULL),
  ('SS-MARTE-PERIODO', 'Periodo orbital', NULL, 'días', 'oficial', 'pendiente', NULL, NULL),
  ('SS-JUPITER-RADIO', 'Radio medio', NULL, 'km', 'oficial', 'pendiente', NULL, NULL),
  ('SS-JUPITER-DIST', 'Distancia media al Sol', NULL, 'UA', 'oficial', 'pendiente', NULL, NULL),
  ('SS-JUPITER-PERIODO', 'Periodo orbital', NULL, 'días', 'oficial', 'pendiente', NULL, NULL),
  ('SS-SATURNO-RADIO', 'Radio medio', NULL, 'km', 'oficial', 'pendiente', NULL, NULL),
  ('SS-SATURNO-DIST', 'Distancia media al Sol', NULL, 'UA', 'oficial', 'pendiente', NULL, NULL),
  ('SS-SATURNO-PERIODO', 'Periodo orbital', NULL, 'días', 'oficial', 'pendiente', NULL, NULL),
  ('SS-URANO-RADIO', 'Radio medio', NULL, 'km', 'oficial', 'pendiente', NULL, NULL),
  ('SS-URANO-DIST', 'Distancia media al Sol', NULL, 'UA', 'oficial', 'pendiente', NULL, NULL),
  ('SS-URANO-PERIODO', 'Periodo orbital', NULL, 'días', 'oficial', 'pendiente', NULL, NULL),
  ('SS-NEPTUNO-RADIO', 'Radio medio', NULL, 'km', 'oficial', 'pendiente', NULL, NULL),
  ('SS-NEPTUNO-DIST', 'Distancia media al Sol', NULL, 'UA', 'oficial', 'pendiente', NULL, NULL),
  ('SS-NEPTUNO-PERIODO', 'Periodo orbital', NULL, 'días', 'oficial', 'pendiente', NULL, NULL);

-- ---------------------------------------------------------------------------
-- Semilla: eventos. La explicación queda pendiente de fuente primaria.
-- ---------------------------------------------------------------------------

INSERT INTO public.eventos (id, mision_id, nombre, orden, explicacion) VALUES
  ('apolo-11-despegue', 'apolo-11', 'Despegue desde la Tierra', 1, 'Pendiente de verificación. Explicación por redactar con la fuente primaria F-NASA-HO.'),
  ('apolo-11-trayectoria', 'apolo-11', 'Trayecto hacia la Luna', 2, 'Pendiente de verificación. Explicación por redactar con la fuente primaria F-NASA-HO.'),
  ('apolo-11-orbita-lunar', 'apolo-11', 'Órbita lunar', 3, 'Pendiente de verificación. Explicación por redactar con la fuente primaria F-NASA-HO.'),
  ('apolo-11-alunizaje', 'apolo-11', 'Alunizaje', 4, 'Pendiente de verificación. Explicación por redactar con la fuente primaria F-NASA-HO.'),
  ('apolo-11-despegue-lunar', 'apolo-11', 'Despegue desde la Luna', 5, 'Pendiente de verificación. Explicación por redactar con la fuente primaria F-NASA-HO.'),
  ('apolo-11-retorno', 'apolo-11', 'Retorno a la Tierra', 6, 'Pendiente de verificación. Explicación por redactar con la fuente primaria F-NASA-HO.'),
  ('artemis-ii-despegue', 'artemis-ii', 'Despegue desde la Tierra', 1, 'Pendiente de verificación. Explicación por redactar con la fuente primaria F-NASA-HO.'),
  ('artemis-ii-sobrevuelo', 'artemis-ii', 'Sobrevuelo lunar', 2, 'Pendiente de verificación. Explicación por redactar con la fuente primaria F-NASA-HO.'),
  ('artemis-ii-retorno', 'artemis-ii', 'Retorno a la Tierra', 3, 'Pendiente de verificación. Explicación por redactar con la fuente primaria F-NASA-HO.'),
  ('artemis-ii-amerizaje', 'artemis-ii', 'Amerizaje', 4, 'Pendiente de verificación. Explicación por redactar con la fuente primaria F-NASA-HO.');
