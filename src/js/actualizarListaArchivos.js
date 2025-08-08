
export async function obtenerArchivosUpload() {
    try {
        const response = await fetch('/api/archivosgcode/show');
        const archivos = await response.json();

        console.log("Archivos obtenidos:", archivos);

        // Limpiar el contenido previo
        document.querySelector('#listaArchivos').innerHTML = '';

        // Crear un elemento <p> por cada archivo y añadirlo al div
        archivos.forEach(nombre => {
            const p = document.createElement('p');
            p.textContent = nombre;

            document.querySelector('#listaArchivos').appendChild(p);
        });
    } catch (err) {
        console.error('Error al obtener archivos:', err);
    }
}

obtenerArchivosUpload();