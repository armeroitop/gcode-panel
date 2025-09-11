import { parsearPosicion } from "../utils/parseadorMensajes.js";

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
}

console.log("Alpine store initialized with posX = 0");

/**
 * Actualiza la posición en el Alpine.store si el mensaje tiene el formato correcto.
 * @param {string} message
 */
export function printPosicion(message) {
    // Si el mensaje recivido comienza por "posicion", actualizar la posición en el panel
    // el mensaje debe tener esta forma: "Posicion actual: (20, 20)"
    const pos = parsearPosicion(message);
    if (pos) {
        Alpine.store('menu').posX = pos.x;
        Alpine.store('menu').posY = pos.y;
        //console.log(`Posición actualizada: X=${pos.x}, Y=${pos.y}`);
    }
}

