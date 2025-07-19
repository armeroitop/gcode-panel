const vistaCache = {};

export async function cargarVista(url) {

    if (vistaCache[url]) {
        return vistaCache[url]; // Devolver desde caché si ya está cargada
    }

    const res = await fetch(url);
    const html = await res.text();
    vistaCache[url] = html; // Guardar en memoria
    return html;
    
}