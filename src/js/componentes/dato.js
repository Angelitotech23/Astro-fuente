// Componente de verificabilidad: cada magnitud de la aplicación pasa por aquí.
//
// vistaDato() es una función pura (sin DOM) y es la que se prueba.
// renderDato() construye el elemento a partir de esa vista usando solo textContent,
// de modo que los datos de la base nunca se interpretan como HTML.

/** Días tras los que un dato verificado pasa a mostrarse como desactualizado. */
export const UMBRAL_DESACTUALIZADO_DIAS = 90;

const TEXTO_ESTADO = {
  verificado: { texto: 'Verificado', icono: '✔' },
  pendiente: { texto: 'Pendiente de verificación', icono: '⏳' },
  desactualizado: { texto: 'Desactualizado', icono: '⚠' },
};

const TEXTO_TIPO = {
  medido: 'Medido',
  oficial: 'Oficial',
  calculado: 'Calculado',
  estimado: 'Estimado',
};

/** Convierte una fecha (Date o 'AAAA-MM-DD') a 'AAAA-MM-DD' en UTC. */
function aIso(fecha) {
  if (fecha instanceof Date) return fecha.toISOString().slice(0, 10);
  return fecha;
}

/** Días completos entre dos fechas 'AAAA-MM-DD' (hoy − fecha). */
export function diasEntre(fechaIso, hoyIso) {
  const a = Date.parse(`${fechaIso}T00:00:00Z`);
  const b = Date.parse(`${hoyIso}T00:00:00Z`);
  return Math.round((b - a) / 86400000);
}

/**
 * Calcula cómo se debe mostrar un dato.
 * @param {object} dato   fila de la tabla `datos`
 * @param {object[]} fuentes filas de la tabla `fuentes`
 * @param {Date|string} hoy fecha de referencia (parámetro para que las pruebas sean deterministas)
 */
export function vistaDato(dato, fuentes, hoy) {
  const hoyIso = aIso(hoy);
  const avisos = [];
  const fuente = fuentes.find((f) => f.id === dato.fuente_id) ?? null;

  let estado = dato.estado;

  if (estado === 'verificado' && !fuente) {
    avisos.push('Sin fuente registrada: no se muestra como verificado.');
    estado = 'pendiente';
  }

  if (estado === 'verificado' && dato.fecha_consulta) {
    const dias = diasEntre(dato.fecha_consulta, hoyIso);
    if (dias > UMBRAL_DESACTUALIZADO_DIAS) {
      estado = 'desactualizado';
      avisos.push(`Consultado hace ${dias} días (umbral: ${UMBRAL_DESACTUALIZADO_DIAS}).`);
    }
  }

  // Un dato pendiente nunca muestra cifra, aunque la fila tuviera valor.
  const sinCifra = estado === 'pendiente' || dato.valor === null || dato.valor === undefined;

  const etiquetaEstado = TEXTO_ESTADO[estado] ?? TEXTO_ESTADO.pendiente;

  return {
    id: dato.id,
    etiqueta: dato.etiqueta,
    estado,
    estadoTexto: etiquetaEstado.texto,
    estadoIcono: etiquetaEstado.icono,
    valorTexto: sinCifra ? null : `${dato.valor} ${dato.unidad}`.trim(),
    mensajePendiente: sinCifra ? 'Pendiente de verificación' : null,
    tipo: dato.tipo,
    tipoTexto: TEXTO_TIPO[dato.tipo] ?? dato.tipo,
    fuente: fuente ? { nombre: fuente.nombre, url: fuente.url, clase: fuente.clase } : null,
    fechaConsulta: dato.fecha_consulta ?? null,
    metodo: dato.tipo === 'calculado' ? dato.metodo ?? null : null,
    supuestos: dato.tipo === 'estimado' ? dato.supuestos ?? null : null,
    avisos,
  };
}

function añadirFila(lista, termino, contenido) {
  const dt = document.createElement('dt');
  dt.textContent = termino;
  const dd = document.createElement('dd');
  if (typeof contenido === 'string') dd.textContent = contenido;
  else dd.append(...contenido);
  lista.append(dt, dd);
}

/** Construye el elemento DOM para una vista de dato. */
export function renderDato(vista) {
  const article = document.createElement('article');
  article.className = `dato dato--${vista.estado}`;
  article.dataset.estado = vista.estado;

  const titulo = document.createElement('h3');
  titulo.className = 'dato__etiqueta';
  titulo.textContent = vista.etiqueta;
  article.append(titulo);

  const lista = document.createElement('dl');
  lista.className = 'dato__campos';

  const valor = vista.valorTexto ?? vista.mensajePendiente;
  añadirFila(lista, 'Valor', valor);

  añadirFila(lista, 'Tipo', vista.tipoTexto);

  if (vista.metodo) añadirFila(lista, 'Método', vista.metodo);
  if (vista.supuestos) añadirFila(lista, 'Supuestos', vista.supuestos);

  if (vista.fuente) {
    const enlace = document.createElement('a');
    enlace.href = vista.fuente.url;
    enlace.rel = 'noopener noreferrer';
    enlace.textContent = vista.fuente.nombre;
    const clase = document.createElement('span');
    clase.className = 'dato__clase';
    clase.textContent = ` (${vista.fuente.clase})`;
    añadirFila(lista, 'Fuente', [enlace, clase]);
  } else {
    añadirFila(lista, 'Fuente', 'Sin fuente registrada');
  }

  if (vista.fechaConsulta) {
    const time = document.createElement('time');
    time.dateTime = vista.fechaConsulta;
    time.textContent = vista.fechaConsulta;
    añadirFila(lista, 'Fecha de consulta', [time]);
  } else {
    añadirFila(lista, 'Fecha de consulta', 'Sin fecha de consulta');
  }

  const estado = document.createElement('span');
  estado.className = 'dato__estado';
  const icono = document.createElement('span');
  icono.setAttribute('aria-hidden', 'true');
  icono.textContent = `${vista.estadoIcono} `;
  estado.append(icono, document.createTextNode(vista.estadoTexto));
  añadirFila(lista, 'Estado', [estado]);

  article.append(lista);

  for (const aviso of vista.avisos) {
    const p = document.createElement('p');
    p.className = 'dato__aviso';
    p.textContent = aviso;
    article.append(p);
  }
  return article;
}
