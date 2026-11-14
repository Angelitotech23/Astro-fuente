-- Pruebas de restricciones y de RLS para el esquema de Astro-fuente.
--
-- Ejecutar contra una base de desarrollo o de prueba (nunca contra producción):
--   psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f tests/db/restricciones.sql
--
-- Cada rechazo esperado se comprueba con un bloque que falla si NO hay error.
-- Todo ocurre dentro de una transacción que termina con ROLLBACK.

BEGIN;

-- 1. Un dato verificado sin fuente debe rechazarse.
DO $$
DECLARE rechazado boolean := false;
BEGIN
  BEGIN
    INSERT INTO public.datos (id, etiqueta, valor, unidad, tipo, estado, fecha_consulta)
    VALUES ('TEST-VERIF-SIN-FUENTE', 'Prueba', '1', 'km', 'medido', 'verificado', '2026-11-14');
  EXCEPTION WHEN check_violation THEN rechazado := true;
  END;
  IF NOT rechazado THEN RAISE EXCEPTION 'FALLO 1: dato verificado sin fuente fue aceptado'; END IF;
END $$;

-- 2. Un dato pendiente con valor debe rechazarse.
DO $$
DECLARE rechazado boolean := false;
BEGIN
  BEGIN
    INSERT INTO public.datos (id, etiqueta, valor, unidad, tipo, estado)
    VALUES ('TEST-PEND-CON-VALOR', 'Prueba', '1', 'km', 'medido', 'pendiente');
  EXCEPTION WHEN check_violation THEN rechazado := true;
  END;
  IF NOT rechazado THEN RAISE EXCEPTION 'FALLO 2: dato pendiente con valor fue aceptado'; END IF;
END $$;

-- 3. Un dato con valor (no pendiente) sin valor nulo debe aceptarse solo con valor; sin valor debe rechazarse.
DO $$
DECLARE rechazado boolean := false;
BEGIN
  BEGIN
    INSERT INTO public.datos (id, etiqueta, valor, unidad, tipo, estado)
    VALUES ('TEST-NO-PEND-SIN-VALOR', 'Prueba', NULL, 'km', 'medido', 'desactualizado');
  EXCEPTION WHEN check_violation THEN rechazado := true;
  END;
  IF NOT rechazado THEN RAISE EXCEPTION 'FALLO 3: dato no pendiente sin valor fue aceptado'; END IF;
END $$;

-- 4. Un dato calculado sin método debe rechazarse.
DO $$
DECLARE rechazado boolean := false;
BEGIN
  BEGIN
    INSERT INTO public.datos (id, etiqueta, valor, unidad, tipo, estado)
    VALUES ('TEST-CALC-SIN-METODO', 'Prueba', '1', 'km', 'calculado', 'desactualizado');
  EXCEPTION WHEN check_violation THEN rechazado := true;
  END;
  IF NOT rechazado THEN RAISE EXCEPTION 'FALLO 4: dato calculado sin método fue aceptado'; END IF;
END $$;

-- 5. Un dato estimado sin supuestos debe rechazarse.
DO $$
DECLARE rechazado boolean := false;
BEGIN
  BEGIN
    INSERT INTO public.datos (id, etiqueta, valor, unidad, tipo, estado)
    VALUES ('TEST-EST-SIN-SUPUESTOS', 'Prueba', '1', 'km', 'estimado', 'desactualizado');
  EXCEPTION WHEN check_violation THEN rechazado := true;
  END;
  IF NOT rechazado THEN RAISE EXCEPTION 'FALLO 5: dato estimado sin supuestos fue aceptado'; END IF;
END $$;

-- 6. Fecha de consulta futura debe rechazarse.
DO $$
DECLARE rechazado boolean := false;
BEGIN
  BEGIN
    INSERT INTO public.datos (id, etiqueta, valor, unidad, tipo, estado, fuente_id, fecha_consulta)
    VALUES ('TEST-FECHA-FUTURA', 'Prueba', '1', 'km', 'medido', 'verificado', 'F-NASA-HO', current_date + 1);
  EXCEPTION WHEN check_violation THEN rechazado := true;
  END;
  IF NOT rechazado THEN RAISE EXCEPTION 'FALLO 6: fecha de consulta futura fue aceptada'; END IF;
END $$;

-- 7. Unidad nula debe rechazarse.
DO $$
DECLARE rechazado boolean := false;
BEGIN
  BEGIN
    INSERT INTO public.datos (id, etiqueta, valor, unidad, tipo, estado)
    VALUES ('TEST-SIN-UNIDAD', 'Prueba', '1', NULL, 'medido', 'desactualizado');
  EXCEPTION WHEN not_null_violation THEN rechazado := true;
  END;
  IF NOT rechazado THEN RAISE EXCEPTION 'FALLO 7: dato sin unidad fue aceptado'; END IF;
END $$;

-- 8. Un dato verificado completo (con fuente y fecha) debe aceptarse.
INSERT INTO public.datos (id, etiqueta, valor, unidad, tipo, estado, fuente_id, fecha_consulta)
VALUES ('TEST-VERIF-OK', 'Prueba', '1', 'km', 'medido', 'verificado', 'F-NASA-HO', '2026-11-14');

-- 9. Un dato pendiente sin valor debe aceptarse.
INSERT INTO public.datos (id, etiqueta, valor, unidad, tipo, estado)
VALUES ('TEST-PEND-OK', 'Prueba', NULL, 'km', 'medido', 'pendiente');

-- 10. Semilla de fuentes presente y no vacía.
DO $$
BEGIN
  IF (SELECT count(*) FROM public.fuentes) <> 8 THEN
    RAISE EXCEPTION 'FALLO 10: la semilla de fuentes no tiene 8 filas (ver docs/fuentes.md)';
  END IF;
END $$;

-- 11. Acceso anónimo: lectura permitida, escritura rechazada.
SET LOCAL ROLE anon;

DO $$
DECLARE n integer;
BEGIN
  SELECT count(*) INTO n FROM public.fuentes;
  IF n = 0 THEN RAISE EXCEPTION 'FALLO 11a: anon no puede leer fuentes'; END IF;
END $$;

DO $$
DECLARE rechazado boolean := false;
BEGIN
  BEGIN
    INSERT INTO public.fuentes (id, nombre, url, clase)
    VALUES ('F-TEST-ANON', 'Prueba', 'https://example.org/', 'primaria');
  EXCEPTION WHEN insufficient_privilege THEN rechazado := true;
  END;
  IF NOT rechazado THEN RAISE EXCEPTION 'FALLO 11b: INSERT anónimo en fuentes fue aceptado'; END IF;
END $$;

DO $$
DECLARE rechazado boolean := false;
BEGIN
  BEGIN
    UPDATE public.datos SET etiqueta = 'cambiado' WHERE id = 'SS-TIERRA-RADIO';
    -- Sin privilegio de UPDATE la sentencia falla; con privilegio, RLS sin política de escritura no afecta filas.
    IF NOT FOUND THEN rechazado := true; END IF;
  EXCEPTION WHEN insufficient_privilege THEN rechazado := true;
  END;
  IF NOT rechazado THEN RAISE EXCEPTION 'FALLO 11c: UPDATE anónimo en datos tuvo efecto'; END IF;
END $$;

RESET ROLE;

ROLLBACK;

\echo 'Todas las pruebas de restricciones y RLS pasaron.'
