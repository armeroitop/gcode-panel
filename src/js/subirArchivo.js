// subir.js
import { obtenerArchivosUpload } from './procesarArchivos.js';
import { eliminarGcode } from './procesarArchivos.js';

console.log('se ha cargado el archivo subirArchivo.js');

document.getElementById('uploadForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = new FormData(this);

    fetch('/api/archivosgcode/upload', {
        method: 'POST',
        body: formData
    })
        .then(resp => resp.text())
        .then(data => {
            document.getElementById('resultado').textContent = data;
            console.log('has enviado el archivo .gcode: '+ data);
            obtenerArchivosUpload();
        })
        .catch(err => {
            document.getElementById('resultado').textContent = 'Error al subir el archivo.';
            console.error(err);
        });
});


if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', () => {
        // Código aquí
        console.log('Evento de carga del dom');
    });
} else {
    // DOM ya listo
    // Ejecuta el código directamente
    console.log('DOM listo del dom');
    const boton = document.querySelector('#eliminarGcode');
    if (!boton) {
        console.warn('Botón de eliminar G-code no encontrado. Asegúrate de que el HTML lo incluya.');
    }
    boton.addEventListener('click', eliminarGcode);
}









