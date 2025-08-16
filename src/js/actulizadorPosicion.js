


function initMenuStore() {
    if (!Alpine.store('menu')) {
        Alpine.store('menu', { 
            init() {
                console.log('Alpine init() initialized forzosamente');
            },
            posX: 0,
            posY: 0 
        });
        console.log('hola desde Alpine store');
    }
}


// Si Alpine no ha cargado aún, usamos el evento
document.addEventListener('alpine:init', () => {
    initMenuStore();
});


// Si Alpine ya está listo, lo ejecutamos directamente
if (window.Alpine && Alpine.start) {
    initMenuStore();
    // Aquí también puedes ejecutar cualquier lógica que quieras después de "alpine:initialized"
    /*setInterval(() => {
        console.log(Alpine.store('menu').posX); // 0
        Alpine.store('menu').posX ++;
        Alpine.store('menu').posY +=2;
        console.log(Alpine.store('menu').posX); // 5
    }, 1000);*/
}

console.log("Alpine store initialized with posX = 0");

export function printPosicion(message){
    // Si el mensaje recivido comienza por "posicion", actualizar la posición en el panel
    // el mensaje debe tener esta forma: "Posicion actual: (20, 20)"
    if (message.startsWith("Posicion actual:")) {
        const partes = message.split(": ");
        if (partes.length === 2) {
            const coordenadas = partes[1].replace(/[()]/g, "").split(", ");
            if (coordenadas.length === 2) {
                const posX = parseFloat(coordenadas[0]);
                const posY = parseFloat(coordenadas[1]);
                Alpine.store('menu').posX = posX;
                Alpine.store('menu').posY = posY;
                console.log(`Posición actualizada: X=${posX}, Y=${posY}`);
            } else {
                console.error("Formato de coordenadas incorrecto:", partes[1]);
            }
        } else {
            console.error("Mensaje de posición mal formado:", message);
        }
    }
}