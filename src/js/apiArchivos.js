import { renderListaArchivos } from './uiArchivos.js';

console.log('cargado actualizarListaArchivos.js');


export async function obtenerArchivosUpload() {
    try {
        const response = await fetch('/api/archivosgcode/show');
        const archivos = await response.json();

        console.log("Archivos obtenidos:", archivos);

        return archivos;

    } catch (err) {
        console.error('Error al obtener archivos:', err);
    }
}


export async function eliminarArchivo() {
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
        })
        .catch(err => {
            console.error('Error al eliminar el archivo:', err);
        });
}

export async function subirArchivo(formData) {
    const resp = await fetch('/api/archivosgcode/upload', {
        method: 'POST',
        body: formData
    });

    // O si responde JSON, cambia por:
    return await resp.json();
}
