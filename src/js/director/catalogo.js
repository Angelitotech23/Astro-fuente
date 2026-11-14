// Catálogo didáctico del Director de misión.
//
// Los valores numéricos son un modelo educativo simplificado. Cada magnitud
// declara fuente, fecha, estado y supuestos. No se presentan como datos
// oficiales de la NASA.

/** μ lunar (km³/s²), constante de Kepler para periodos orbitales calculados. */
export const MU_LUNAR_KM3_S2 = 4902.800066;

/** Radio medio de la Luna (km). */
export const RADIO_LUNAR_KM = 1737.4;

export const FUENTES_DIRECTOR = [
  {
    id: 'F-HORIZONS',
    nombre: 'JPL Horizons System',
    url: 'https://ssd.jpl.nasa.gov/horizons/',
    clase: 'primaria',
    notas: 'Referencia del método de efemérides. El periodo orbital del juego se calcula con Kepler, no se consulta Horizons en vivo en el MVP.',
  },
  {
    id: 'F-AF-DIR',
    nombre: 'Astro-fuente · modelo didáctico del Director',
    url: 'https://github.com/Angelitotech23/Astro-fuente',
    clase: 'secundaria',
    notas: 'Valores de masa, potencia, costo y enlace de datos del juego. Estimados educativos, no fichas oficiales de vuelo.',
  },
];

export const OBJETIVOS = [
  {
    id: 'orbita-ciencia-lunar',
    nombre: 'Ciencia en órbita lunar',
    destino: 'lunar',
    presupuesto: 90,
    duracionMaxDias: 120,
    cienciaMin: 40,
    datosMinMbps: 8,
    descripcion: 'Insertar un bus en órbita lunar baja y devolver datos científicos durante al menos 90 días.',
  },
  {
    id: 'recon-lunar',
    nombre: 'Reconocimiento lunar',
    destino: 'lunar',
    presupuesto: 70,
    duracionMaxDias: 60,
    cienciaMin: 30,
    datosMinMbps: 20,
    descripcion: 'Cartografiar la superficie con imagen de alta tasa. Prioriza downlink frente a masa de instrumentos.',
  },
  {
    id: 'demo-leo',
    nombre: 'Demostración en LEO',
    destino: 'leo',
    presupuesto: 40,
    duracionMaxDias: 30,
    cienciaMin: 15,
    datosMinMbps: 2,
    descripcion: 'Probar el bus en órbita terrestre baja antes de una misión lunar.',
  },
];

export const BUSES = [
  {
    id: 'bus-ligero',
    nombre: 'Bus ligero',
    masaKg: 85,
    potenciaW: 55,
    antenaMbps: 12,
    costo: 18,
    fuenteId: 'F-AF-DIR',
    fechaConsulta: '2026-11-14',
    estado: 'estimado',
    supuestos: 'Plataforma educativa. Masa seca sin propelente de inserción.',
  },
  {
    id: 'bus-medio',
    nombre: 'Bus medio',
    masaKg: 220,
    potenciaW: 140,
    antenaMbps: 35,
    costo: 32,
    fuenteId: 'F-AF-DIR',
    fechaConsulta: '2026-11-14',
    estado: 'estimado',
    supuestos: 'Más margen de potencia y antena de media ganancia.',
  },
  {
    id: 'bus-pesado',
    nombre: 'Bus pesado',
    masaKg: 480,
    potenciaW: 320,
    antenaMbps: 80,
    costo: 55,
    fuenteId: 'F-AF-DIR',
    fechaConsulta: '2026-11-14',
    estado: 'estimado',
    supuestos: 'Capacidad alta de potencia y datos; consume gran parte del presupuesto.',
  },
];

export const INSTRUMENTOS = [
  {
    id: 'camara',
    nombre: 'Cámara de contexto',
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
  },
  {
    id: 'espectrometro',
    nombre: 'Espectrómetro',
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
  },
  {
    id: 'magnetometro',
    nombre: 'Magnetómetro',
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
  },
  {
    id: 'imagen-hires',
    nombre: 'Imagen de alta resolución',
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
  },
  {
    id: 'radar',
    nombre: 'Radar de apertura sintética',
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
  },
];

export const LANZADORES = [
  {
    id: 'lanzador-pequeno',
    nombre: 'Lanzador pequeño',
    capacidadLeoKg: 400,
    capacidadLunarKg: 120,
    costo: 12,
    destinos: ['leo'],
    fuenteId: 'F-AF-DIR',
    fechaConsulta: '2026-11-14',
    estado: 'estimado',
    supuestos: 'Capacidad lunar muy limitada (escenario didáctico).',
  },
  {
    id: 'lanzador-medio',
    nombre: 'Lanzador medio',
    capacidadLeoKg: 2500,
    capacidadLunarKg: 550,
    costo: 28,
    destinos: ['leo', 'lunar'],
    fuenteId: 'F-AF-DIR',
    fechaConsulta: '2026-11-14',
    estado: 'estimado',
    supuestos: 'Capaz de inyección translunar con payload moderado.',
  },
  {
    id: 'lanzador-pesado',
    nombre: 'Lanzador pesado',
    capacidadLeoKg: 8000,
    capacidadLunarKg: 2200,
    costo: 48,
    destinos: ['leo', 'lunar'],
    fuenteId: 'F-AF-DIR',
    fechaConsulta: '2026-11-14',
    estado: 'estimado',
    supuestos: 'Amplio margen de masa; consume presupuesto.',
  },
];

export const ORBITAS = [
  {
    id: 'leo-500',
    nombre: 'LEO 500 km',
    destino: 'leo',
    altitudKm: 500,
    factorEnlace: 1,
    margenInsercionKg: 0,
    duracionUtilDias: 30,
    fuenteId: 'F-AF-DIR',
    fechaConsulta: '2026-11-14',
    estado: 'estimado',
    supuestos: 'Órbita terrestre de demostración. No sirve para objetivos lunares.',
  },
  {
    id: 'lunar-100',
    nombre: 'Órbita lunar circular 100 km',
    destino: 'lunar',
    altitudKm: 100,
    factorEnlace: 0.55,
    margenInsercionKg: 40,
    duracionUtilDias: 120,
    fuenteId: 'F-HORIZONS',
    fechaConsulta: '2026-11-14',
    estado: 'calculado',
    supuestos: 'Periodo vía Kepler con μ lunar. Factor de enlace didáctico (visibilidad Tierra).',
  },
  {
    id: 'lunar-eliptica',
    nombre: 'Órbita lunar elíptica 50×200 km',
    destino: 'lunar',
    altitudKm: 125,
    factorEnlace: 0.4,
    margenInsercionKg: 55,
    duracionUtilDias: 90,
    fuenteId: 'F-HORIZONS',
    fechaConsulta: '2026-11-14',
    estado: 'calculado',
    supuestos: 'Altitud media aproximada para el periodo. Enlace más intermitente.',
  },
  {
    id: 'lunar-alta',
    nombre: 'Órbita lunar alta 1000 km',
    destino: 'lunar',
    altitudKm: 1000,
    factorEnlace: 0.7,
    margenInsercionKg: 70,
    duracionUtilDias: 180,
    fuenteId: 'F-HORIZONS',
    fechaConsulta: '2026-11-14',
    estado: 'calculado',
    supuestos: 'Mejor geometría de enlace, peor resolución de imagen de superficie.',
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
