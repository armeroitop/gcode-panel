var conn = new WebSocket(`ws://${window.location.hostname}:8080`); // Asegúrate de usar la IP de tu Banana Pi

conn.onopen = function(e) {
    console.log("Conexión WebSocket abierta");
};

conn.onmessage = function(e) {
    console.log("Mensaje recibido: " + e.data);
    //alert(e.data); // Mostrar en pantalla el mensaje del servidor
};

// Función para procesar el G-code
function procesarGcode() {
    var nombreArchivo = document.getElementById("gcodeFile").files[0].name; // Nombre del archivo subido
    conn.send("procesar " + nombreArchivo); // Enviar el comando al servidor WebSocket
}
