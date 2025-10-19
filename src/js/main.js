import { WSClient } from "./wsClient.js";
import { GcodeService } from "./gcodeService.js";
import { printPosicion } from "./actulizadorPosicion.js";
import { mostrarEnRecuadroMensajes } from "./panelCentral.js";
import * as canvasGcode from "./canvasGcode.js";

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
        canvasGcode.dibujarCabezal(message);
        canvasGcode.dibujarTrazado(message);
    }

    // Mensajes de ejecución de comandos antes de comenzar a ejecutarlos
    if (esComandoEjecucion(message)) {
        canvasGcode.actualizarPosicionTarget(message);
        console.log("Comando en ejecución: " + message);
    }

    // Mensajes de ejecución de comandos despues de ejecutarlos
    if (esComandoInterpretado(message) || esComandoBoli(message)) {
        canvasGcode.actualizarPosicionBoli(message);
    }
   
    // Mensajes de parada
    if (esMensajeParada(message)){
        console.log("Mensaje de parada recibido: " + message);
        canvasGcode.alertaMargenFinalDeCarrera(message);
        canvasGcode.actualizarSetaParadaEmergencia(message);
    }

    // Puedes añadir más condiciones y funciones aquí:
    if (esMensajeError(message)) {
        canvasGcode.mostrarError(message);
    }

    if(esMensajeInformativo(message)){
        canvasGcode.recibirMensajeInformativo(message);
    }

    // ...otros tipos de mensajes
}



function esMensajePosicion(message) {
    return message.startsWith("Posicion actual:");
}

function esComandoEjecucion(mensaje) {
    return mensaje.startsWith("[Executor] Ejecutando:");
}

function esComandoInterpretado(mensaje) {
    return mensaje.startsWith("[Executor] Linea interpretada:");
}

function esComandoBoli(mensaje) {
    return mensaje.startsWith("[ServoBoli] metodo:");
}


function esMensajeError(message) {
    return message.startsWith("ERROR:");
}

function esMensajeParada(mensaje){
    return mensaje.startsWith("[Parada]");
}

function mostrarError(message) {
    alert("Error recibido: " + message);
}

function esMensajeInformativo(message){
    return message.startsWith("Informacion General:");
}