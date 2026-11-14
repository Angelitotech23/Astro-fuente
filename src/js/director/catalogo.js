// Catálogo didáctico del Director de misión.
//
// Los valores numéricos son un modelo educativo simplificado. Cada magnitud
// declara fuente, fecha, estado y supuestos. No se presentan como datos
// oficiales de la NASA.

/** μ lunar (km³/s²), constante de Kepler para periodos orbitales calculados. */
export const MU_LUNAR_KM3_S2 = 4902.800066;

/** Radio medio de la Luna (km). */
export const RADIO_LUNAR_KM = 1737.4;

/** Etiqueta localizada: usa `nombreEn`/`descripcionEn` cuando lang === 'en'. */
export function etiqueta(item, lang, campo = 'nombre') {
  if (lang === 'en') {
    const en = item[`${campo}En`];
    if (en) return en;
  }
  return item[campo];
}

export const FUENTES_DIRECTOR = [
  {
    id: 'F-HORIZONS',
    nombre: 'JPL Horizons System',
    url: 'https://ssd.jpl.nasa.gov/horizons/',
    clase: 'primaria',
    notas: 'Referencia del método de efemérides. El periodo orbital del juego se calcula con Kepler, no se consulta Horizons en vivo en el MVP.',
    notasEn: 'Ephemeris method reference. The game orbital period is computed with Kepler; Horizons is not queried live in the MVP.',
  },
  {
    id: 'F-AF-DIR',
    nombre: 'Astro-fuente · modelo didáctico del Director',
    nombreEn: 'Astro-fuente · Mission Director educational model',
    url: 'https://github.com/Angelitotech23/Astro-fuente',
    clase: 'secundaria',
    notas: 'Valores de masa, potencia, costo y enlace de datos del juego. Estimados educativos, no fichas oficiales de vuelo.',
    notasEn: 'Game values for mass, power, cost, and data link. Educational estimates, not official flight datasheets.',
  },
];

export const OBJETIVOS = [
  {
    id: 'orbita-ciencia-lunar',
    nombre: 'Ciencia en órbita lunar',
    nombreEn: 'Lunar science orbit',
    destino: 'lunar',
    presupuesto: 90,
    duracionMaxDias: 120,
    cienciaMin: 40,
    datosMinMbps: 8,
    descripcion: 'Insertar un bus en órbita lunar baja y devolver datos científicos durante al menos 90 días.',
    descripcionEn: 'Insert a bus into low lunar orbit and return science data for at least 90 days.',
  },
  {
    id: 'recon-lunar',
    nombre: 'Reconocimiento lunar',
    nombreEn: 'Lunar reconnaissance',
    destino: 'lunar',
    presupuesto: 70,
    duracionMaxDias: 60,
    cienciaMin: 30,
    datosMinMbps: 20,
    descripcion: 'Cartografiar la superficie con imagen de alta tasa. Prioriza downlink frente a masa de instrumentos.',
    descripcionEn: 'Map the surface with high-rate imaging. Prioritizes downlink over instrument mass.',
  },
  {
    id: 'demo-leo',
    nombre: 'Demostración en LEO',
    nombreEn: 'LEO demonstration',
    destino: 'leo',
    presupuesto: 40,
    duracionMaxDias: 30,
    cienciaMin: 15,
    datosMinMbps: 2,
    descripcion: 'Probar el bus en órbita terrestre baja antes de una misión lunar.',
    descripcionEn: 'Prove the bus in low Earth orbit before a lunar mission.',
  },
];

export const BUSES = [
  {
    id: 'bus-ligero',
    nombre: 'Bus ligero',
    nombreEn: 'Light bus',
    masaKg: 85,
    potenciaW: 55,
    antenaMbps: 12,
    costo: 18,
    fuenteId: 'F-AF-DIR',
    fechaConsulta: '2026-11-14',
    estado: 'estimado',
    supuestos: 'Plataforma educativa. Masa seca sin propelente de inserción.',
    supuestosEn: 'Educational platform. Dry mass without insertion propellant.',
  },
  {
    id: 'bus-medio',
    nombre: 'Bus medio',
    nombreEn: 'Medium bus',
    masaKg: 220,
    potenciaW: 140,
    antenaMbps: 35,
    costo: 32,
    fuenteId: 'F-AF-DIR',
    fechaConsulta: '2026-11-14',
    estado: 'estimado',
    supuestos: 'Más margen de potencia y antena de media ganancia.',
    supuestosEn: 'More power margin and a medium-gain antenna.',
  },
  {
    id: 'bus-pesado',
    nombre: 'Bus pesado',
    nombreEn: 'Heavy bus',
    masaKg: 480,
    potenciaW: 320,
    antenaMbps: 80,
    costo: 55,
    fuenteId: 'F-AF-DIR',
    fechaConsulta: '2026-11-14',
    estado: 'estimado',
    supuestos: 'Capacidad alta de potencia y datos; consume gran parte del presupuesto.',
    supuestosEn: 'High power and data capacity; consumes much of the budget.',
  },
];

export const INSTRUMENTOS = [
  {
    id: 'camara',
    nombre: 'Cámara de contexto',
    nombreEn: 'Context camera',
    masaKg: 12,
    potenciaW: 18,
    datosMbps: 15,
    ciencia: 18,
    costo: 6,
    etiquetas: ['imagen'],
    fuenteId: 'F-AF-DIR',
    fechaConsulta: '2026-11-14',
    estado: 'estimado',
    supuestos: 'Óptica visible de campo amplio.',
    supuestosEn: 'Wide-field visible optics.',
  },
  {
    id: 'espectrometro',
    nombre: 'Espectrómetro',
    nombreEn: 'Spectrometer',
    masaKg: 28,
    potenciaW: 40,
    datosMbps: 4,
    ciencia: 28,
    costo: 11,
    etiquetas: ['espectro'],
    fuenteId: 'F-AF-DIR',
    fechaConsulta: '2026-11-14',
    estado: 'estimado',
    supuestos: 'Espectroscopia de superficie; tasa de datos moderada.',
    supuestosEn: 'Surface spectroscopy; moderate data rate.',
  },
  {
    id: 'magnetometro',
    nombre: 'Magnetómetro',
    nombreEn: 'Magnetometer',
    masaKg: 6,
    potenciaW: 4,
    datosMbps: 0.5,
    ciencia: 12,
    costo: 4,
    etiquetas: ['campo'],
    fuenteId: 'F-AF-DIR',
    fechaConsulta: '2026-11-14',
    estado: 'estimado',
    supuestos: 'Sensor de campo magnético de bajo consumo.',
    supuestosEn: 'Low-power magnetic field sensor.',
  },
  {
    id: 'imagen-hires',
    nombre: 'Imagen de alta resolución',
    nombreEn: 'High-resolution imager',
    masaKg: 48,
    potenciaW: 75,
    datosMbps: 55,
    ciencia: 32,
    costo: 16,
    etiquetas: ['imagen', 'hires'],
    fuenteId: 'F-AF-DIR',
    fechaConsulta: '2026-11-14',
    estado: 'estimado',
    supuestos: 'Alta tasa de datos: exige antena y órbita con buen enlace.',
    supuestosEn: 'High data rate: needs a strong antenna and orbit link.',
  },
  {
    id: 'radar',
    nombre: 'Radar de apertura sintética',
    nombreEn: 'Synthetic aperture radar',
    masaKg: 95,
    potenciaW: 160,
    datosMbps: 30,
    ciencia: 40,
    costo: 24,
    etiquetas: ['radar'],
    fuenteId: 'F-AF-DIR',
    fechaConsulta: '2026-11-14',
    estado: 'estimado',
    supuestos: 'Instrumento pesado y sediento de potencia.',
    supuestosEn: 'Heavy, power-hungry instrument.',
  },
];

export const LANZADORES = [
  {
    id: 'lanzador-pequeno',
    nombre: 'Lanzador pequeño',
    nombreEn: 'Small launcher',
    capacidadLeoKg: 400,
    capacidadLunarKg: 120,
    costo: 12,
    destinos: ['leo'],
    fuenteId: 'F-AF-DIR',
    fechaConsulta: '2026-11-14',
    estado: 'estimado',
    supuestos: 'Capacidad lunar muy limitada (escenario didáctico).',
    supuestosEn: 'Very limited lunar capacity (educational scenario).',
  },
  {
    id: 'lanzador-medio',
    nombre: 'Lanzador medio',
    nombreEn: 'Medium launcher',
    capacidadLeoKg: 2500,
    capacidadLunarKg: 550,
    costo: 28,
    destinos: ['leo', 'lunar'],
    fuenteId: 'F-AF-DIR',
    fechaConsulta: '2026-11-14',
    estado: 'estimado',
    supuestos: 'Capaz de inyección translunar con payload moderado.',
    supuestosEn: 'Can perform translunar injection with a moderate payload.',
  },
  {
    id: 'lanzador-pesado',
    nombre: 'Lanzador pesado',
    nombreEn: 'Heavy launcher',
    capacidadLeoKg: 8000,
    capacidadLunarKg: 2200,
    costo: 48,
    destinos: ['leo', 'lunar'],
    fuenteId: 'F-AF-DIR',
    fechaConsulta: '2026-11-14',
    estado: 'estimado',
    supuestos: 'Amplio margen de masa; consume presupuesto.',
    supuestosEn: 'Large mass margin; consumes budget.',
  },
];

export const ORBITAS = [
  {
    id: 'leo-500',
    nombre: 'LEO 500 km',
    nombreEn: 'LEO 500 km',
    destino: 'leo',
    altitudKm: 500,
    factorEnlace: 1,
    margenInsercionKg: 0,
    duracionUtilDias: 30,
    fuenteId: 'F-AF-DIR',
    fechaConsulta: '2026-11-14',
    estado: 'estimado',
    supuestos: 'Órbita terrestre de demostración. No sirve para objetivos lunares.',
    supuestosEn: 'Earth demonstration orbit. Not valid for lunar objectives.',
  },
  {
    id: 'lunar-100',
    nombre: 'Órbita lunar circular 100 km',
    nombreEn: 'Circular lunar orbit 100 km',
    destino: 'lunar',
    altitudKm: 100,
    factorEnlace: 0.55,
    margenInsercionKg: 40,
    duracionUtilDias: 120,
    fuenteId: 'F-HORIZONS',
    fechaConsulta: '2026-11-14',
    estado: 'calculado',
    supuestos: 'Periodo vía Kepler con μ lunar. Factor de enlace didáctico (visibilidad Tierra).',
    supuestosEn: 'Period via Kepler with lunar μ. Educational Earth-visibility link factor.',
  },
  {
    id: 'lunar-eliptica',
    nombre: 'Órbita lunar elíptica 50×200 km',
    nombreEn: 'Elliptical lunar orbit 50×200 km',
    destino: 'lunar',
    altitudKm: 125,
    factorEnlace: 0.4,
    margenInsercionKg: 55,
    duracionUtilDias: 90,
    fuenteId: 'F-HORIZONS',
    fechaConsulta: '2026-11-14',
    estado: 'calculado',
    supuestos: 'Altitud media aproximada para el periodo. Enlace más intermitente.',
    supuestosEn: 'Approximate mean altitude for the period. More intermittent link.',
  },
  {
    id: 'lunar-alta',
    nombre: 'Órbita lunar alta 1000 km',
    nombreEn: 'High lunar orbit 1000 km',
    destino: 'lunar',
    altitudKm: 1000,
    factorEnlace: 0.7,
    margenInsercionKg: 70,
    duracionUtilDias: 180,
    fuenteId: 'F-HORIZONS',
    fechaConsulta: '2026-11-14',
    estado: 'calculado',
    supuestos: 'Mejor geometría de enlace, peor resolución de imagen de superficie.',
    supuestosEn: 'Better link geometry, worse surface imaging resolution.',
  },
];

/** Periodo orbital Kepleriano en horas. */
export function periodoOrbitalHoras(orbita) {
  if (orbita.destino === 'leo') {
    const muTierra = 398600.4418;
    const radio = 6378.137 + orbita.altitudKm;
    const segundos = 2 * Math.PI * Math.sqrt((radio ** 3) / muTierra);
    return segundos / 3600;
  }
  const a = RADIO_LUNAR_KM + orbita.altitudKm;
  const segundos = 2 * Math.PI * Math.sqrt((a ** 3) / MU_LUNAR_KM3_S2);
  return segundos / 3600;
}

export function buscarPorId(lista, id) {
  return lista.find((item) => item.id === id) ?? null;
}
