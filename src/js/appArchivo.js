import {
    obtenerArchivosUpload,
    eliminarArchivo,
    subirArchivo
} from './apiArchivos.js';

import { renderListaArchivos } from './uiArchivos.js';

console.log('se ha cargado el archivo subirArchivo.js');



async function init() {
    //debugger; // fuerza detenerse aquí
    console.log('Has llamado a init() de appArchivo.js');

    const archivos = await obtenerArchivosUpload();
    renderListaArchivos(archivos);

    // Evento para eliminar archivo en la lista de archivos.
    document.querySelector('#eliminarGcode').addEventListener('click', async function (e) {
        const resultado = await eliminarArchivo();
        // Refrescar lista
        const archivos = await obtenerArchivosUpload();
        renderListaArchivos(archivos);

    });

    // Evento para subir archivo .gcode
    document.getElementById('uploadForm').addEventListener('submit', async function (e) {
        e.preventDefault();

        const formData = new FormData(this);

        try {
            const resultado = await subirArchivo(formData);
            document.getElementById('resultado').textContent = resultado['mensaje'];

            console.log('Has enviado el archivo .gcode: ' + resultado);

            // Refrescar lista
            const archivos = await obtenerArchivosUpload();
            renderListaArchivos(archivos);

        } catch (err) {
            document.getElementById('resultado').textContent = 'Error al subir el archivo.';
            console.error(err);
        }
    });

}

init();

document.addEventListener("routerRecargado", init); //TODO: falta meter comprobaciones para que se ejecute solo en la pagina que debe









