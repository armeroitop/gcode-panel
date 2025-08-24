import { WSClient } from "./wsClient.js";
import { GcodeService } from "./gcodeService.js";
import { printPosicion } from "./actulizadorPosicion.js";

const wsClient = new WSClient(`ws://${window.location.hostname}:8080`);
const gcodeService = new GcodeService(wsClient);

wsClient.onOpen(() => {
    console.log("Conexión WebSocket abierta");
    document.dispatchEvent(new Event("wsConectado"));
});

wsClient.onMessage((message) => {
    console.log("Mensaje recibido: " + message);
    // TODO: Aqui hay que pasar los mensajes recibidos el panel central, en el recuadro de mensajes negro
    const mensajes = document.getElementById("recuadroMensajes");
    mensajes.innerHTML += `<p>${message}</p>`;
    mensajes.scrollTop = mensajes.scrollHeight; // Desplazar hacia abajo para mostrar el último

    printPosicion(message); // Actualizar la posición si el mensaje es de tipo "Posicion actual:"
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

window.enviarComando = function (comando) {
    gcodeService.enviarComando(comando);
}

window.estadoConexion = function () {
    return wsClient.conn.readyState;
}

