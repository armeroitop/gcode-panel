// subir.js
import { obtenerArchivosUpload } from './actualizarListaArchivos.js';

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










