// Utilidades mínimas de DOM. Todo texto se asigna con textContent.

export function el(tag, atributos = {}, hijos = []) {
  const nodo = document.createElement(tag);
  for (const [clave, valor] of Object.entries(atributos)) {
    if (valor === undefined || valor === null || valor === false) continue;
    if (clave === 'class') nodo.className = valor;
    else if (clave === 'text') nodo.textContent = valor;
    else if (clave.startsWith('on') && typeof valor === 'function') nodo.addEventListener(clave.slice(2), valor);
    else nodo.setAttribute(clave, valor === true ? '' : String(valor));
  }
  for (const h of [].concat(hijos)) {
    if (h === null || h === undefined || h === false) continue;
    nodo.append(h instanceof Node ? h : document.createTextNode(String(h)));
  }
  return nodo;
}

export const SVG_NS = 'http://www.w3.org/2000/svg';

export function svg(tag, atributos = {}, hijos = []) {
  const nodo = document.createElementNS(SVG_NS, tag);
  for (const [clave, valor] of Object.entries(atributos)) {
    if (valor === undefined || valor === null || valor === false) continue;
    nodo.setAttribute(clave, String(valor));
  }
  for (const h of [].concat(hijos)) {
    if (h === null || h === undefined || h === false) continue;
    nodo.append(h instanceof Node ? h : document.createTextNode(String(h)));
  }
  return nodo;
}

/** Aviso visible cuando los datos no se pudieron cargar. */
export function avisoDatos(error) {
  if (!error) return null;
  const texto = error.codigo === 'sin_configuracion'
    ? 'Base de datos no configurada todavía. Los datos aparecen como pendientes de verificación.'
    : 'No se pudieron cargar los datos. Se muestran como pendientes de verificación.';
  return el('p', { class: 'aviso', role: 'status' }, [texto]);
}
