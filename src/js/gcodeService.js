export class GcodeService {

    constructor(wsClient) {
        this.wsClient = wsClient;
    }

    procesarArchivo(nombreArchivo) {
        this.wsClient.send("procesar " + nombreArchivo); // Enviar el comando al servidor WebSocket    
    }

    mover(x, y){
        this.wsClient.send(`comando G91`);
        this.wsClient.send(`comando G1 X${x} Y${y}`); // Enviar el comando para mover a una posición específica
    }

    enviarComando(comando) {
        this.wsClient.send(`comando ${comando}`); // Enviar el comando al servidor WebSocket
    }
}