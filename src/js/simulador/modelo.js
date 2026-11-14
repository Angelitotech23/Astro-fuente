// Modelo físico simplificado de una fase vertical de cohete.
//
// Supuestos: una sola fase, sin arrastre atmosférico, gravedad g constante,
// sin control de actitud y sin frenado. Tras el agotamiento del propelente
// el vehículo sigue un retorno balístico.
//
// Estado: y = [h, v, m] (altura, velocidad, masa).
// Parámetros: { m0, mf, mdot, ve, g }
//   m0   masa inicial (incluye propelente)
//   mf   masa seca, al final de la combustión
//   mdot caudal másico de propelente (ṁ)
//   ve   velocidad efectiva de escape
//   g    aceleración gravitatoria constante

/** Caso didáctico sintético. No corresponde a ningún vehículo real. */
export const CASO_DIDACTICO = Object.freeze({ m0: 2, mf: 1, mdot: 1, ve: 1, g: 0.1 });

/** Tiempo de combustión: t_b = (m0 − mf) / ṁ. */
export function tiempoCombustion({ m0, mf, mdot }) {
  return (m0 - mf) / mdot;
}

/** Empuje durante la combustión: F = ṁ · v_e. */
export function empuje({ mdot, ve }) {
  return mdot * ve;
}

/**
 * Derivadas del estado. Usa la masa del propio estado, no m0.
 *   dh/dt = v
 *   dv/dt = F/m(t) − g   (durante la combustión; después F = 0)
 *   dm/dt = −ṁ           (durante la combustión; después 0)
 *
 * La fase se pasa explícitamente (`quemando`). No se deduce de t: con RK4
 * la última etapa de la combustión cae exactamente en t_b, y deducirla de t
 * aplicaría la fase balística a esa etapa y sesgaría la solución.
 */
export function derivadas(t, y, params, quemando = t < tiempoCombustion(params)) {
  const [, v, m] = y;
  const F = quemando ? empuje(params) : 0;
  const dm = quemando ? -params.mdot : 0;
  return [v, F / m - params.g, dm];
}

/** Aceleración dv/dt en el instante dado (para las gráficas). */
export function aceleracion(t, y, params) {
  return derivadas(t, y, params)[1];
}
