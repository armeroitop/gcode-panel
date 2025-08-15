/*document.addEventListener('alpine:init', () => {
    Alpine.store('menu', { 
        init() {
                this.on = console.log('Alpine init() initialized');
            },
        posX: 0 
    });
    console.log('hola desde Alpine store'); 
});

document.addEventListener('alpine:initialized', () => {
    setTimeout(() => {
        console.log(Alpine.store('menu').posX); // 0
        Alpine.store('menu').posX = 5;          // cambia el valor
        console.log(Alpine.store('menu').posX); // 5
    }, 1000);
});*/


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
    setInterval(() => {
        console.log(Alpine.store('menu').posX); // 0
        Alpine.store('menu').posX ++;
        Alpine.store('menu').posY +=2;
        console.log(Alpine.store('menu').posX); // 5
    }, 1000);
}

console.log("Alpine store initialized with posX = 0");