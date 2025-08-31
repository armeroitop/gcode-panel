
export function mostrarEnRecuadroMensajes(message) { 
     // Aqui hay que pasar los mensajes recibidos el panel central, en el recuadro de mensajes negro
    const mensajes = document.getElementById("recuadroMensajes");
    mensajes.innerHTML += `<p>${message}</p>`;
    mensajes.scrollTop = mensajes.scrollHeight; // Desplazar hacia abajo para mostrar el último
}