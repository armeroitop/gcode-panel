import { WSClient } from "./wsClient.js";
import { GcodeService } from "./gcodeService.js";

const wsClient = new WSClient(`ws://${window.location.hostname}:8080`);
const gcodeService = new GcodeService(wsClient);

wsClient.onOpen(() => {
    console.log("Conexión WebSocket abierta");
});

wsClient.onMessage((message) => {
    console.log("Mensaje recibido: " + message);
    // TODO: Aqui hay que pasar los mensajes recibidos el panel central, en el recuadro de mensajes negro
    const mensajes = document.getElementById("recuadroMensajes");
    mensajes.innerHTML += `<p style="">${message}</p>`;
    mensajes.scrollTop = mensajes.scrollHeight; // Desplazar hacia abajo para mostrar el último
});

// Por si la anterior no funciona, dejo esta alternativa por aquí
/* wsClient.onMessage(msg => console.log("Mensaje recibido:", msg)); */

// Función para procesar el G-code
window.procesarGcode = function () {
    //var nombreArchivo = document.getElementById("gcodeFile").files[0].name; // Nombre del archivo subido
    const archivoSeleccionado = document.querySelector('#listaArchivos a.active');
    if (!archivoSeleccionado) {
        alert("Necesitas seleccionar un archivo G-code primero.");
        return;
    }
    
    console.log("Procesando archivo:", archivoSeleccionado.textContent);

    gcodeService.procesarArchivo(archivoSeleccionado.textContent); // Enviar el comando al servidor WebSocket
}


window.mover = function (x, y) {
    gcodeService.mover(x, y);
}