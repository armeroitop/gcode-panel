
export async function obtenerArchivosUpload() {
    try {
        const response = await fetch('/api/archivosgcode/show');
        const archivos = await response.json();

        console.log("Archivos obtenidos:", archivos);

        // Limpiar el contenido previo
        document.querySelector('#listaArchivos').innerHTML = '';

        // Crear un elemento <p> por cada archivo y añadirlo al div
        archivos.forEach(nombre => {
            const a = document.createElement('a');
            a.href = "#";
            a.className = "list-group-item";
            a.setAttribute('data-bs-toggle', 'list');
            a.textContent = nombre;

            document.querySelector('#listaArchivos').appendChild(a);
        });
    } catch (err) {
        console.error('Error al obtener archivos:', err);
    }
}

obtenerArchivosUpload();

console.log('cargado actualizarListaArchivos.js');


export async function eliminarGcode() {
    console.log('Has pulsado eliminarGcode');

    const archivoSeleccionado = document.querySelector('#listaArchivos a.active');
    if (!archivoSeleccionado) {
        alert("Necesitas seleccionar un archivo G-code primero.");
        return;
    }
    const nombreArchivo = archivoSeleccionado.textContent;

    fetch(`/api/archivosgcode/delete`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre: nombreArchivo })
    })
        .then(resp => resp.text())
        .then(data => {
            console.log('Archivo eliminado:', data);
            obtenerArchivosUpload();
        })
        .catch(err => {
            console.error('Error al eliminar el archivo:', err);
        });
}


