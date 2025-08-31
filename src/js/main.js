import { WSClient } from "./wsClient.js";
import { GcodeService } from "./gcodeService.js";
import { printPosicion } from "./actulizadorPosicion.js";
import { mostrarEnRecuadroMensajes} from "./panelCentral.js";
import { dibujarCabezal, dibujarTrazado } from "./canvasGcode.js";

const wsClient = new WSClient(`ws://${window.location.hostname}:8080`);
const gcodeService = new GcodeService(wsClient);

wsClient.onOpen(() => {
    console.log("Conexión WebSocket abierta");
    document.dispatchEvent(new Event("wsConectado"));
});

wsClient.onMessage((message) => {
    console.log("Mensaje recibido: " + message);
    manejarMensajes(message);
});

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

function manejarMensajes(message) {
    mostrarEnRecuadroMensajes(message);

    if (esMensajePosicion(message)) {
        printPosicion(message);
        dibujarCabezal(message);
        dibujarTrazado(message);
    }

    // Puedes añadir más condiciones y funciones aquí:
    if (esMensajeError(message)) {
        mostrarError(message);
    }

    // ...otros tipos de mensajes
}

/*function mostrarEnRecuadroMensajes(message) {
     // Aqui hay que pasar los mensajes recibidos el panel central, en el recuadro de mensajes negro
    const mensajes = document.getElementById("recuadroMensajes");
    mensajes.innerHTML += `<p>${message}</p>`;
    mensajes.scrollTop = mensajes.scrollHeight; // Desplazar hacia abajo para mostrar el último
}*/

function esMensajePosicion(message) {
    return message.startsWith("Posicion actual:");
}

function esMensajeError(message) {
    return message.startsWith("ERROR:");
}

function mostrarError(message) {
    alert("Error recibido: " + message);
}