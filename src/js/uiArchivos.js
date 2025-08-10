export function renderListaArchivos(lista) {
    const contenedor = document.querySelector('#listaArchivos');
    contenedor.innerHTML = '';
    lista.forEach(nombre => {
        const a = document.createElement('a');
        a.href = '#';
        a.className = 'list-group-item';
        a.setAttribute('data-bs-toggle', 'list');
        a.textContent = nombre;
        contenedor.appendChild(a);
    });
}

export function getArchivoSeleccionado() {
    return document.querySelector('#listaArchivos .active')?.textContent || null;
}