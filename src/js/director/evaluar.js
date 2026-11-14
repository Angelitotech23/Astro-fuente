// Motor puro de evaluación del Director de misión.
// Entrada: selecciones del jugador. Salida: presupuestos, chequeos y debrief causal.

import {
  BUSES,
  INSTRUMENTOS,
  LANZADORES,
  OBJETIVOS,
  ORBITAS,
  buscarPorId,
  periodoOrbitalHoras,
} from './catalogo.js';

const MAX_INSTRUMENTOS = 3;

/**
 * @typedef {object} Seleccion
 * @property {string|null} objetivoId
 * @property {string|null} busId
 * @property {string[]} instrumentoIds
 * @property {string|null} lanzadorId
 * @property {string|null} orbitaId
 */

/**
 * Normaliza la selección y resuelve entidades del catálogo.
 * @param {Seleccion} seleccion
 */
export function resolverSeleccion(seleccion) {
  const instrumentoIds = [...new Set(seleccion.instrumentoIds ?? [])].slice(0, MAX_INSTRUMENTOS);
  return {
    objetivo: buscarPorId(OBJETIVOS, seleccion.objetivoId),
    bus: buscarPorId(BUSES, seleccion.busId),
    instrumentos: instrumentoIds
      .map((id) => buscarPorId(INSTRUMENTOS, id))
      .filter(Boolean),
    lanzador: buscarPorId(LANZADORES, seleccion.lanzadorId),
    orbita: buscarPorId(ORBITAS, seleccion.orbitaId),
    incompleta: !(
      seleccion.objetivoId
      && seleccion.busId
      && seleccion.lanzadorId
      && seleccion.orbitaId
      && instrumentoIds.length > 0
    ),
  };
}

function sumar(lista, clave) {
  return lista.reduce((acc, item) => acc + item[clave], 0);
}

/**
 * Calcula los presupuestos agregados de la configuración.
 * @param {ReturnType<typeof resolverSeleccion>} resuelto
 */
export function presupuestos(resuelto) {
  const { bus, instrumentos, lanzador, orbita, objetivo } = resuelto;
  if (!bus || !lanzador || !orbita || !objetivo) return null;

  const masaInstrumentos = sumar(instrumentos, 'masaKg');
  const potenciaInstrumentos = sumar(instrumentos, 'potenciaW');
  const datosInstrumentos = sumar(instrumentos, 'datosMbps');
  const ciencia = sumar(instrumentos, 'ciencia');
  const costoInstrumentos = sumar(instrumentos, 'costo');

  const masaTotalKg = bus.masaKg + masaInstrumentos + orbita.margenInsercionKg;
  const capacidadKg = objetivo.destino === 'lunar'
    ? lanzador.capacidadLunarKg
    : lanzador.capacidadLeoKg;
  const potenciaUsadaW = bus.potenciaW * 0.15 + potenciaInstrumentos; // 15% bus de aviónica
  const enlaceMbps = bus.antenaMbps * orbita.factorEnlace;
  const costoTotal = bus.costo + costoInstrumentos + lanzador.costo;
  const periodoH = periodoOrbitalHoras(orbita);

  return {
    masaTotalKg,
    masaInstrumentosKg: masaInstrumentos,
    margenInsercionKg: orbita.margenInsercionKg,
    capacidadKg,
    potenciaUsadaW,
    potenciaDisponibleW: bus.potenciaW,
    datosDemandadosMbps: datosInstrumentos,
    enlaceMbps,
    ciencia,
    costoTotal,
    presupuesto: objetivo.presupuesto,
    periodoHoras: periodoH,
    duracionUtilDias: orbita.duracionUtilDias,
    duracionMaxDias: objetivo.duracionMaxDias,
  };
}

/**
 * Evalúa compatibilidad y produce un debrief causal ordenado.
 * @param {Seleccion} seleccion
 */
export function evaluarMision(seleccion) {
  const resuelto = resolverSeleccion(seleccion);
  if (resuelto.incompleta) {
    return {
      estado: 'incompleta',
      exito: false,
      puntuacion: 0,
      resuelto,
      presupuestos: null,
      chequeos: [],
      causas: [{
        id: 'incompleta',
        severidad: 'bloqueante',
        mensaje: 'Falta elegir objetivo, bus, al menos un instrumento, lanzador y órbita.',
      }],
    };
  }

  const p = presupuestos(resuelto);
  const { objetivo, bus, instrumentos, lanzador, orbita } = resuelto;
  const chequeos = [];
  const causas = [];

  const destinoOk = lanzador.destinos.includes(objetivo.destino)
    && orbita.destino === objetivo.destino;
  chequeos.push({
    id: 'destino',
    ok: destinoOk,
    etiqueta: 'Destino compatible',
    detalle: destinoOk
      ? `Lanzador y órbita cubren destino «${objetivo.destino}».`
      : `El objetivo pide «${objetivo.destino}», pero lanzador [${lanzador.destinos.join(', ')}] u órbita «${orbita.destino}» no coinciden.`,
  });
  if (!destinoOk) {
    causas.push({
      id: 'destino',
      severidad: 'bloqueante',
      mensaje: `Incompatibilidad de destino: la misión apunta a ${objetivo.destino}, pero el lanzador o la órbita no llegan ahí.`,
      cadena: [
        `Objetivo «${objetivo.nombre}» → destino ${objetivo.destino}`,
        `Lanzador «${lanzador.nombre}» → [${lanzador.destinos.join(', ')}]`,
        `Órbita «${orbita.nombre}» → ${orbita.destino}`,
      ],
    });
  }

  const masaOk = p.masaTotalKg <= p.capacidadKg;
  chequeos.push({
    id: 'masa',
    ok: masaOk,
    etiqueta: 'Masa vs capacidad del lanzador',
    detalle: `${p.masaTotalKg.toFixed(1)} kg usados / ${p.capacidadKg} kg de capacidad (${objetivo.destino}).`,
  });
  if (!masaOk) {
    const exceso = p.masaTotalKg - p.capacidadKg;
    causas.push({
      id: 'masa',
      severidad: 'bloqueante',
      mensaje: `La masa total supera la capacidad del lanzador en ${exceso.toFixed(1)} kg.`,
      cadena: [
        `Bus «${bus.nombre}»: ${bus.masaKg} kg`,
        `Instrumentos: ${p.masaInstrumentosKg.toFixed(1)} kg`,
        `Margen de inserción de la órbita: ${p.margenInsercionKg} kg`,
        `Total ${p.masaTotalKg.toFixed(1)} kg > capacidad ${p.capacidadKg} kg`,
      ],
    });
  }

  const potenciaOk = p.potenciaUsadaW <= p.potenciaDisponibleW;
  chequeos.push({
    id: 'potencia',
    ok: potenciaOk,
    etiqueta: 'Potencia',
    detalle: `${p.potenciaUsadaW.toFixed(1)} W demandados / ${p.potenciaDisponibleW} W del bus.`,
  });
  if (!potenciaOk) {
    causas.push({
      id: 'potencia',
      severidad: 'bloqueante',
      mensaje: `La potencia pico de los instrumentos supera la del bus en ${(p.potenciaUsadaW - p.potenciaDisponibleW).toFixed(1)} W.`,
      cadena: [
        `Aviónica del bus (15%): ${(bus.potenciaW * 0.15).toFixed(1)} W`,
        ...instrumentos.map((i) => `${i.nombre}: ${i.potenciaW} W`),
        `Total ${p.potenciaUsadaW.toFixed(1)} W > ${p.potenciaDisponibleW} W`,
      ],
    });
  }

  const datosOk = p.enlaceMbps + 1e-9 >= Math.max(objetivo.datosMinMbps, p.datosDemandadosMbps * 0.35);
  const enlaceCubreDemanda = p.enlaceMbps >= p.datosDemandadosMbps * 0.35;
  const enlaceCubreObjetivo = p.enlaceMbps >= objetivo.datosMinMbps;
  chequeos.push({
    id: 'datos',
    ok: datosOk,
    etiqueta: 'Enlace de datos',
    detalle: `Enlace efectivo ${p.enlaceMbps.toFixed(1)} Mbps · demanda instrumentos ${p.datosDemandadosMbps.toFixed(1)} Mbps · mínimo del objetivo ${objetivo.datosMinMbps} Mbps.`,
  });
  if (!datosOk) {
    causas.push({
      id: 'datos',
      severidad: 'bloqueante',
      mensaje: !enlaceCubreObjetivo
        ? `El enlace (${p.enlaceMbps.toFixed(1)} Mbps) no alcanza el mínimo del objetivo (${objetivo.datosMinMbps} Mbps).`
        : `El enlace (${p.enlaceMbps.toFixed(1)} Mbps) no cubre el 35% de la demanda de instrumentos (${p.datosDemandadosMbps.toFixed(1)} Mbps).`,
      cadena: [
        `Antena del bus: ${bus.antenaMbps} Mbps`,
        `Factor de enlace de la órbita: ×${orbita.factorEnlace}`,
        `Enlace efectivo: ${p.enlaceMbps.toFixed(1)} Mbps`,
        !enlaceCubreDemanda
          ? `Instrumentos piden ${p.datosDemandadosMbps.toFixed(1)} Mbps (umbral operativo 35%)`
          : `Objetivo exige ≥ ${objetivo.datosMinMbps} Mbps`,
      ],
    });
  }

  const costoOk = p.costoTotal <= p.presupuesto;
  chequeos.push({
    id: 'presupuesto',
    ok: costoOk,
    etiqueta: 'Presupuesto',
    detalle: `${p.costoTotal} unidades usadas / ${p.presupuesto} disponibles.`,
  });
  if (!costoOk) {
    causas.push({
      id: 'presupuesto',
      severidad: 'bloqueante',
      mensaje: `El costo (${p.costoTotal}) supera el presupuesto (${p.presupuesto}).`,
      cadena: [
        `Bus: ${bus.costo}`,
        `Instrumentos: ${sumar(instrumentos, 'costo')}`,
        `Lanzador: ${lanzador.costo}`,
        `Total ${p.costoTotal} > ${p.presupuesto}`,
      ],
    });
  }

  // La órbita debe sostener al menos el 75% de la duración pedida por el objetivo.
  const duracionSuficiente = orbita.duracionUtilDias >= objetivo.duracionMaxDias * 0.75;
  chequeos.push({
    id: 'duracion',
    ok: duracionSuficiente,
    etiqueta: 'Duración útil de la órbita',
    detalle: `${orbita.duracionUtilDias} días útiles / objetivo ${objetivo.duracionMaxDias} días (umbral 75%).`,
  });
  if (!duracionSuficiente) {
    causas.push({
      id: 'duracion',
      severidad: 'bloqueante',
      mensaje: `La órbita solo ofrece ${orbita.duracionUtilDias} días útiles; el objetivo pide ${objetivo.duracionMaxDias} días.`,
      cadena: [
        `Órbita «${orbita.nombre}»: ${orbita.duracionUtilDias} días`,
        `Objetivo «${objetivo.nombre}»: ${objetivo.duracionMaxDias} días`,
      ],
    });
  }

  const cienciaOk = p.ciencia >= objetivo.cienciaMin;
  chequeos.push({
    id: 'ciencia',
    ok: cienciaOk,
    etiqueta: 'Retorno científico',
    detalle: `${p.ciencia} puntos / mínimo ${objetivo.cienciaMin}.`,
  });
  if (!cienciaOk) {
    causas.push({
      id: 'ciencia',
      severidad: 'bloqueante',
      mensaje: `La carga científica (${p.ciencia}) no llega al mínimo del objetivo (${objetivo.cienciaMin}).`,
      cadena: instrumentos.map((i) => `${i.nombre}: +${i.ciencia}`),
    });
  }

  // Penalización suave: imagen hires en órbita alta pierde resolución de superficie.
  if (instrumentos.some((i) => i.etiquetas.includes('hires')) && orbita.id === 'lunar-alta') {
    causas.push({
      id: 'resolucion',
      severidad: 'aviso',
      mensaje: 'La imagen de alta resolución en órbita lunar alta degrada la resolución de superficie.',
      cadena: [
        'Instrumento con etiqueta hires seleccionado',
        'Órbita a 1000 km → peor escala espacial',
      ],
    });
    chequeos.push({
      id: 'resolucion',
      ok: false,
      etiqueta: 'Resolución de imagen',
      detalle: 'Aviso: hires + órbita alta reduce valor cartográfico.',
    });
  } else {
    chequeos.push({
      id: 'resolucion',
      ok: true,
      etiqueta: 'Resolución de imagen',
      detalle: 'Sin conflicto de resolución detectado.',
    });
  }

  const bloqueantes = causas.filter((c) => c.severidad === 'bloqueante');
  const exito = bloqueantes.length === 0;
  let puntuacion = 0;
  if (exito) {
    const margenMasa = (p.capacidadKg - p.masaTotalKg) / p.capacidadKg;
    const margenPotencia = (p.potenciaDisponibleW - p.potenciaUsadaW) / p.potenciaDisponibleW;
    const margenCosto = (p.presupuesto - p.costoTotal) / p.presupuesto;
    const cienciaExtra = Math.min(1, (p.ciencia - objetivo.cienciaMin) / Math.max(objetivo.cienciaMin, 1));
    puntuacion = Math.round(
      55
      + 15 * Math.max(0, margenMasa)
      + 10 * Math.max(0, margenPotencia)
      + 10 * Math.max(0, margenCosto)
      + 10 * Math.max(0, cienciaExtra),
    );
    const avisos = causas.filter((c) => c.severidad === 'aviso');
    puntuacion = Math.max(40, puntuacion - avisos.length * 8);
  }

  return {
    estado: exito ? 'exito' : 'fallo',
    exito,
    puntuacion,
    resuelto,
    presupuestos: p,
    chequeos,
    causas,
  };
}

export { MAX_INSTRUMENTOS };
