// Integradores de paso fijo para sistemas de EDO y = f(t, y).
// Euler es la referencia de orden 1; RK4 es el método de orden 4 que usa el simulador.

/** Un paso de Euler explícito (orden 1). */
export function pasoEuler(f, t, y, h) {
  const k = f(t, y);
  return y.map((yi, i) => yi + h * k[i]);
}

/** Un paso de Runge-Kutta clásico de cuarto orden. */
export function pasoRK4(f, t, y, h) {
  const k1 = f(t, y);
  const k2 = f(t + h / 2, y.map((yi, i) => yi + (h / 2) * k1[i]));
  const k3 = f(t + h / 2, y.map((yi, i) => yi + (h / 2) * k2[i]));
  const k4 = f(t + h, y.map((yi, i) => yi + h * k3[i]));
  return y.map((yi, i) => yi + (h / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]));
}

/**
 * Integra n pasos de tamaño h desde t0 con el paso indicado.
 * Si se pasa `alPaso`, se llama con (t, y) tras cada paso.
 * El tiempo se calcula como t0 + k·h para evitar acumulación de error.
 */
export function integrar(paso, f, t0, y0, h, n, alPaso) {
  let y = y0;
  for (let k = 0; k < n; k += 1) {
    const t = t0 + k * h;
    y = paso(f, t, y, h);
    if (alPaso) alPaso(t0 + (k + 1) * h, y);
  }
  return { t: t0 + n * h, y };
}
