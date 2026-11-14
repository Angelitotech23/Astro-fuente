// Motor puro de evaluación del Director de misión.
// Entrada: selecciones del jugador (+ idioma). Salida: presupuestos, chequeos y debrief causal.

import {
  BUSES,
  INSTRUMENTOS,
  LANZADORES,
  OBJETIVOS,
  ORBITAS,
  buscarPorId,
  etiqueta,
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
  const potenciaUsadaW = bus.potenciaW * 0.15 + potenciaInstrumentos;
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

function n(item, lang) {
  return etiqueta(item, lang, 'nombre');
}

/**
 * Evalúa compatibilidad y produce un debrief causal ordenado.
 * @param {Seleccion} seleccion
 * @param {'es'|'en'} [lang='es']
 */
export function evaluarMision(seleccion, lang = 'es') {
  const en = lang === 'en';
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
        mensaje: en
          ? 'Pick an objective, bus, at least one instrument, launcher, and orbit.'
          : 'Falta elegir objetivo, bus, al menos un instrumento, lanzador y órbita.',
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
    etiqueta: en ? 'Compatible destination' : 'Destino compatible',
    detalle: destinoOk
      ? (en
        ? `Launcher and orbit cover destination “${objetivo.destino}”.`
        : `Lanzador y órbita cubren destino «${objetivo.destino}».`)
      : (en
        ? `Objective needs “${objetivo.destino}”, but launcher [${lanzador.destinos.join(', ')}] or orbit “${orbita.destino}” do not match.`
        : `El objetivo pide «${objetivo.destino}», pero lanzador [${lanzador.destinos.join(', ')}] u órbita «${orbita.destino}» no coinciden.`),
  });
  if (!destinoOk) {
    causas.push({
      id: 'destino',
      severidad: 'bloqueante',
      mensaje: en
        ? `Destination mismatch: the mission targets ${objetivo.destino}, but the launcher or orbit cannot get there.`
        : `Incompatibilidad de destino: la misión apunta a ${objetivo.destino}, pero el lanzador o la órbita no llegan ahí.`,
      cadena: [
        en
          ? `Objective “${n(objetivo, lang)}” → destination ${objetivo.destino}`
          : `Objetivo «${n(objetivo, lang)}» → destino ${objetivo.destino}`,
        en
          ? `Launcher “${n(lanzador, lang)}” → [${lanzador.destinos.join(', ')}]`
          : `Lanzador «${n(lanzador, lang)}» → [${lanzador.destinos.join(', ')}]`,
        en
          ? `Orbit “${n(orbita, lang)}” → ${orbita.destino}`
          : `Órbita «${n(orbita, lang)}» → ${orbita.destino}`,
      ],
    });
  }

  const masaOk = p.masaTotalKg <= p.capacidadKg;
  chequeos.push({
    id: 'masa',
    ok: masaOk,
    etiqueta: en ? 'Mass vs launcher capacity' : 'Masa vs capacidad del lanzador',
    detalle: en
      ? `${p.masaTotalKg.toFixed(1)} kg used / ${p.capacidadKg} kg capacity (${objetivo.destino}).`
      : `${p.masaTotalKg.toFixed(1)} kg usados / ${p.capacidadKg} kg de capacidad (${objetivo.destino}).`,
  });
  if (!masaOk) {
    const exceso = p.masaTotalKg - p.capacidadKg;
    causas.push({
      id: 'masa',
      severidad: 'bloqueante',
      mensaje: en
        ? `Total mass exceeds launcher capacity by ${exceso.toFixed(1)} kg.`
        : `La masa total supera la capacidad del lanzador en ${exceso.toFixed(1)} kg.`,
      cadena: [
        en
          ? `Bus “${n(bus, lang)}”: ${bus.masaKg} kg`
          : `Bus «${n(bus, lang)}»: ${bus.masaKg} kg`,
        en
          ? `Instruments: ${p.masaInstrumentosKg.toFixed(1)} kg`
          : `Instrumentos: ${p.masaInstrumentosKg.toFixed(1)} kg`,
        en
          ? `Orbit insertion margin: ${p.margenInsercionKg} kg`
          : `Margen de inserción de la órbita: ${p.margenInsercionKg} kg`,
        en
          ? `Total ${p.masaTotalKg.toFixed(1)} kg > capacity ${p.capacidadKg} kg`
          : `Total ${p.masaTotalKg.toFixed(1)} kg > capacidad ${p.capacidadKg} kg`,
      ],
    });
  }

  const potenciaOk = p.potenciaUsadaW <= p.potenciaDisponibleW;
  chequeos.push({
    id: 'potencia',
    ok: potenciaOk,
    etiqueta: en ? 'Power' : 'Potencia',
    detalle: en
      ? `${p.potenciaUsadaW.toFixed(1)} W demanded / ${p.potenciaDisponibleW} W from bus.`
      : `${p.potenciaUsadaW.toFixed(1)} W demandados / ${p.potenciaDisponibleW} W del bus.`,
  });
  if (!potenciaOk) {
    causas.push({
      id: 'potencia',
      severidad: 'bloqueante',
      mensaje: en
        ? `Peak instrument power exceeds the bus by ${(p.potenciaUsadaW - p.potenciaDisponibleW).toFixed(1)} W.`
        : `La potencia pico de los instrumentos supera la del bus en ${(p.potenciaUsadaW - p.potenciaDisponibleW).toFixed(1)} W.`,
      cadena: [
        en
          ? `Bus avionics (15%): ${(bus.potenciaW * 0.15).toFixed(1)} W`
          : `Aviónica del bus (15%): ${(bus.potenciaW * 0.15).toFixed(1)} W`,
        ...instrumentos.map((i) => `${n(i, lang)}: ${i.potenciaW} W`),
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
    etiqueta: en ? 'Data link' : 'Enlace de datos',
    detalle: en
      ? `Effective link ${p.enlaceMbps.toFixed(1)} Mbps · instrument demand ${p.datosDemandadosMbps.toFixed(1)} Mbps · objective minimum ${objetivo.datosMinMbps} Mbps.`
      : `Enlace efectivo ${p.enlaceMbps.toFixed(1)} Mbps · demanda instrumentos ${p.datosDemandadosMbps.toFixed(1)} Mbps · mínimo del objetivo ${objetivo.datosMinMbps} Mbps.`,
  });
  if (!datosOk) {
    causas.push({
      id: 'datos',
      severidad: 'bloqueante',
      mensaje: !enlaceCubreObjetivo
        ? (en
          ? `Link (${p.enlaceMbps.toFixed(1)} Mbps) is below the objective minimum (${objetivo.datosMinMbps} Mbps).`
          : `El enlace (${p.enlaceMbps.toFixed(1)} Mbps) no alcanza el mínimo del objetivo (${objetivo.datosMinMbps} Mbps).`)
        : (en
          ? `Link (${p.enlaceMbps.toFixed(1)} Mbps) does not cover 35% of instrument demand (${p.datosDemandadosMbps.toFixed(1)} Mbps).`
          : `El enlace (${p.enlaceMbps.toFixed(1)} Mbps) no cubre el 35% de la demanda de instrumentos (${p.datosDemandadosMbps.toFixed(1)} Mbps).`),
      cadena: [
        en ? `Bus antenna: ${bus.antenaMbps} Mbps` : `Antena del bus: ${bus.antenaMbps} Mbps`,
        en ? `Orbit link factor: ×${orbita.factorEnlace}` : `Factor de enlace de la órbita: ×${orbita.factorEnlace}`,
        en ? `Effective link: ${p.enlaceMbps.toFixed(1)} Mbps` : `Enlace efectivo: ${p.enlaceMbps.toFixed(1)} Mbps`,
        !enlaceCubreDemanda
          ? (en
            ? `Instruments need ${p.datosDemandadosMbps.toFixed(1)} Mbps (35% operating threshold)`
            : `Instrumentos piden ${p.datosDemandadosMbps.toFixed(1)} Mbps (umbral operativo 35%)`)
          : (en
            ? `Objective requires ≥ ${objetivo.datosMinMbps} Mbps`
            : `Objetivo exige ≥ ${objetivo.datosMinMbps} Mbps`),
      ],
    });
  }

  const costoOk = p.costoTotal <= p.presupuesto;
  chequeos.push({
    id: 'presupuesto',
    ok: costoOk,
    etiqueta: en ? 'Budget' : 'Presupuesto',
    detalle: en
      ? `${p.costoTotal} units used / ${p.presupuesto} available.`
      : `${p.costoTotal} unidades usadas / ${p.presupuesto} disponibles.`,
  });
  if (!costoOk) {
    causas.push({
      id: 'presupuesto',
      severidad: 'bloqueante',
      mensaje: en
        ? `Cost (${p.costoTotal}) exceeds budget (${p.presupuesto}).`
        : `El costo (${p.costoTotal}) supera el presupuesto (${p.presupuesto}).`,
      cadena: [
        en ? `Bus: ${bus.costo}` : `Bus: ${bus.costo}`,
        en ? `Instruments: ${sumar(instrumentos, 'costo')}` : `Instrumentos: ${sumar(instrumentos, 'costo')}`,
        en ? `Launcher: ${lanzador.costo}` : `Lanzador: ${lanzador.costo}`,
        `Total ${p.costoTotal} > ${p.presupuesto}`,
      ],
    });
  }

  const duracionSuficiente = orbita.duracionUtilDias >= objetivo.duracionMaxDias * 0.75;
  chequeos.push({
    id: 'duracion',
    ok: duracionSuficiente,
    etiqueta: en ? 'Useful orbit duration' : 'Duración útil de la órbita',
    detalle: en
      ? `${orbita.duracionUtilDias} useful days / objective ${objetivo.duracionMaxDias} days (75% threshold).`
      : `${orbita.duracionUtilDias} días útiles / objetivo ${objetivo.duracionMaxDias} días (umbral 75%).`,
  });
  if (!duracionSuficiente) {
    causas.push({
      id: 'duracion',
      severidad: 'bloqueante',
      mensaje: en
        ? `Orbit only offers ${orbita.duracionUtilDias} useful days; objective asks for ${objetivo.duracionMaxDias} days.`
        : `La órbita solo ofrece ${orbita.duracionUtilDias} días útiles; el objetivo pide ${objetivo.duracionMaxDias} días.`,
      cadena: [
        en
          ? `Orbit “${n(orbita, lang)}”: ${orbita.duracionUtilDias} days`
          : `Órbita «${n(orbita, lang)}»: ${orbita.duracionUtilDias} días`,
        en
          ? `Objective “${n(objetivo, lang)}”: ${objetivo.duracionMaxDias} days`
          : `Objetivo «${n(objetivo, lang)}»: ${objetivo.duracionMaxDias} días`,
      ],
    });
  }

  const cienciaOk = p.ciencia >= objetivo.cienciaMin;
  chequeos.push({
    id: 'ciencia',
    ok: cienciaOk,
    etiqueta: en ? 'Science return' : 'Retorno científico',
    detalle: en
      ? `${p.ciencia} points / minimum ${objetivo.cienciaMin}.`
      : `${p.ciencia} puntos / mínimo ${objetivo.cienciaMin}.`,
  });
  if (!cienciaOk) {
    causas.push({
      id: 'ciencia',
      severidad: 'bloqueante',
      mensaje: en
        ? `Science payload (${p.ciencia}) is below the objective minimum (${objetivo.cienciaMin}).`
        : `La carga científica (${p.ciencia}) no llega al mínimo del objetivo (${objetivo.cienciaMin}).`,
      cadena: instrumentos.map((i) => `${n(i, lang)}: +${i.ciencia}`),
    });
  }

  if (instrumentos.some((i) => i.etiquetas.includes('hires')) && orbita.id === 'lunar-alta') {
    causas.push({
      id: 'resolucion',
      severidad: 'aviso',
      mensaje: en
        ? 'High-resolution imaging from a high lunar orbit degrades surface resolution.'
        : 'La imagen de alta resolución en órbita lunar alta degrada la resolución de superficie.',
      cadena: [
        en ? 'Instrument tagged hires selected' : 'Instrumento con etiqueta hires seleccionado',
        en ? 'Orbit at 1000 km → worse spatial scale' : 'Órbita a 1000 km → peor escala espacial',
      ],
    });
    chequeos.push({
      id: 'resolucion',
      ok: false,
      etiqueta: en ? 'Imaging resolution' : 'Resolución de imagen',
      detalle: en
        ? 'Warning: hires + high orbit reduces mapping value.'
        : 'Aviso: hires + órbita alta reduce valor cartográfico.',
    });
  } else {
    chequeos.push({
      id: 'resolucion',
      ok: true,
      etiqueta: en ? 'Imaging resolution' : 'Resolución de imagen',
      detalle: en ? 'No resolution conflict detected.' : 'Sin conflicto de resolución detectado.',
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
