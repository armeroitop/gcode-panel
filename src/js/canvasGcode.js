import * as parseadorMensajes from "../utils/parseadorMensajes.js";

class CanvasManager {
    constructor(canvasId, ancho_mm = 240, alto_mm = 260) {
        this.ancho_mm = ancho_mm;
        this.alto_mm = alto_mm;

        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            throw new Error(`No se encontró el canvas con id: ${canvasId}`);
        }

        this.scale = 2.2; // mm -> px, configurable

        // 🔹 Calculamos tamaño en píxeles a partir de mm
        this.width_px = this.ancho_mm * this.scale;
        this.height_px = this.alto_mm * this.scale;

        // 🔹 Ajustamos el tamaño interno de los canvas
        this.canvas.width = this.width_px;
        this.canvas.height = this.height_px;

        // 🔹 Ajustamos también el tamaño visible (CSS)
        this.canvas.style.width = this.width_px + "px";
        this.canvas.style.height = this.height_px + "px";

        this.ctx = this.canvas.getContext("2d");

        // Aplicamos transformación para sistema cartesiano
        //this.ctx.translate(0, this.canvas.height);
        //this.ctx.scale(1, -1);

        // Definimos los límites del área de dibujo en coordenadas globales
        this.xmin = -this.canvas.width / (2 * this.scale);
        this.xmax = this.canvas.width / (2 * this.scale);
        this.ymin = -this.canvas.height / (2 * this.scale);
        this.ymax = this.canvas.height / (2 * this.scale);

    }

    clear() {
        this.ctx.save();
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.restore();
        //this.ctx.setTransform(1, 0, 0, -1, 0, this.canvas.height); // reset transform temporal
    }

    modificarOrigen() {
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);      // identidad
        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);    // bajar origen
        this.ctx.scale(1, -1);                        // invertir eje Y
    }

    getContext() {
        return this.ctx;
    }

    getScale() {
        return this.scale;
    }

    setScale(newScale) {
        this.scale = newScale;
    }

    resize() {
        const div = this.canvas.parentElement;
        this.canvas.width = div.clientWidth;
        this.canvas.height = div.clientHeight;
    }
}

class Ejes {
    constructor(ctx, scale) {
        this.ctx = ctx;
        this.scale = scale;
    }

    dibujarEjes() {
        const width = this.ctx.canvas.width;
        const height = this.ctx.canvas.height;
        const centerX = width / 2;
        const centerY = height / 2;

        this.ctx.lineWidth = 1;

        // Eje X
        this.ctx.strokeStyle = "red";
        this.ctx.beginPath();
        this.ctx.moveTo(0, centerY);
        this.ctx.lineTo(width, centerY);
        this.ctx.stroke();
        this.ctx.fillStyle = "gray";

        // Marcas cada 10 unidades
        const step = 10 * this.scale;
        for (let x = centerX; x < width; x += step) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, centerY - 5);
            this.ctx.lineTo(x, centerY + 5);
            this.ctx.stroke();
            //this.ctx.fillText(((x - centerX) / this.scale).toFixed(0), x + 2, centerY - 7);
            this.ctx.fillText(((x - centerX) / this.scale).toFixed(0), x, centerY - 7);
        }
        for (let x = centerX; x > 0; x -= step) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, centerY - 5);
            this.ctx.lineTo(x, centerY + 5);
            this.ctx.stroke();
            this.ctx.fillText(((x - centerX) / this.scale).toFixed(0), x, centerY - 7);
        }

        // Eje Y
        this.ctx.strokeStyle = "green";
        this.ctx.beginPath();
        this.ctx.moveTo(centerX, 0);
        this.ctx.lineTo(centerX, height);
        this.ctx.stroke();

        // Marcas cada 10 unidades
        for (let y = centerY; y < height; y += step) {
            this.ctx.beginPath();
            this.ctx.moveTo(centerX - 5, y);
            this.ctx.lineTo(centerX + 5, y);
            this.ctx.stroke();
            this.ctx.fillText(((y - centerY) / this.scale).toFixed(0), centerX + 8, y + 3);
        }
        for (let y = centerY; y > 0; y -= step) {
            this.ctx.beginPath();
            this.ctx.moveTo(centerX - 5, y);
            this.ctx.lineTo(centerX + 5, y);
            this.ctx.stroke();
            this.ctx.fillText(((y - centerY) / this.scale).toFixed(0), centerX + 8, y + 3);
        }
    }
}

class Trazado {
    constructor(ctx, scale, color = "blue", grosor = 2) {
        this.ctx = ctx;
        this.scale = scale;
        this.color = color;
        this.grosor = grosor;
    }

    dibujarTrazado(path) {
        if (path.length === 0) return;

        this.ctx.beginPath();
        this.ctx.moveTo(path[0].x * this.scale, path[0].y * this.scale);
        for (let i = 1; i < path.length; i++) {
            this.ctx.lineTo(path[i].x * this.scale, path[i].y * this.scale);
        }
        this.ctx.strokeStyle = this.color;
        this.ctx.lineWidth = this.grosor;
        this.ctx.stroke();
    }
}

class Cabezal {
    constructor(ctx, scale) {
        this.ctx = ctx;
        this.scale = scale;
    }

    dibujarCabezal(pos, color = "red") {
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(pos.x * this.scale, pos.y * this.scale, 5, 0, Math.PI * 2);
        this.ctx.fill();
    }
}

class VisorTrazado {
    constructor(canvasId) {
        this.canvasManager = new CanvasManager(canvasId);
        this.ejes = new Ejes(this.canvasManager.getContext(), this.canvasManager.getScale());
        this.trazado = new Trazado(this.canvasManager.getContext(), this.canvasManager.getScale());
    }

    init() {
        this.canvasManager.clear();
        this.canvasManager.resize();
        this.ejes.dibujarEjes();
        this.canvasManager.modificarOrigen();
    }

    dibujarTrazado(path) {
        this.trazado.dibujarTrazado(path);
    }
}

class VisorCabezal {
    constructor(canvasId) {
        this.canvasManager = new CanvasManager(canvasId);
        this.cabezal = new Cabezal(this.canvasManager.getContext(), this.canvasManager.getScale());
    }

    init() {
        this.canvasManager.clear();
        this.canvasManager.resize();
        this.canvasManager.modificarOrigen();
    }
    dibujarCabezal(pos, color) {
        this.cabezal.dibujarCabezal(pos, color);
    }

}



let visorTrazado;
let visorCabezal;
let posX_ultima = 0;
let posY_ultima = 0;
let posX_target = 0;
let posY_target = 0;
let movimientoRelativo = false;
let boliPintando = false;

export function init() {

    // Pregunto a la maquina su información inicial {posicion, estdoParadaEmergencia, etc}
    enviarComando('M100'); 

    visorTrazado = new VisorTrazado("canvasTrazado");
    visorCabezal = new VisorCabezal("canvasCabezal");    

    visorTrazado.init();
    visorCabezal.init();
}

/**
 * Dibuja la posición actual del cabezal o boli en el canvas en color rojo
 * @param {string} mensaje 
 */
export function dibujarCabezal(mensaje) {
    const pos = parseadorMensajes.parsearPosicion(mensaje);
    if (pos) {
        visorCabezal.init();
        visorCabezal.dibujarCabezal(pos);
    }
}

/**
 * Actualiza la siguiente posición target del cabezal y la dibuja en verde en el canvas
 */
export function actualizarPosicionTarget(mensaje) {
    // Comprobar si el movimiento a sido relativo o absoluto
    actualizaMovimientoRelativo(mensaje);

    // Dibujar el target de proxima posicion,
    // las coordenadas proximas serán: Si es m.relativo serán las ultimas mas el movimiento
    // y si son absolutas pues las que indica el comando G1 Xtal Ytal
    const posTarget = parseadorMensajes.parsearMovimientoEnEjecucion(mensaje);
    if (posTarget) {
        if (movimientoRelativo) {
            posX_target = posX_ultima + posTarget.x;
            posY_target = posY_ultima + posTarget.y;
        } else {
            posX_target = posTarget.x;
            posY_target = posTarget.y;
        }
        dibujarTarget({ x: posX_target, y: posY_target });
    }
}

/**
 * Dibuja el trazado en el canvas segun el mensaje recibido. 
 * En azul los trazados con el boli pintando y en gris cuando 
 * el boli está arriba
 * @param {string} mensaje 
 */
export function dibujarTrazado(mensaje) {

    const pos = parseadorMensajes.parsearPosicion(mensaje);
    if (pos) {
        const trazado = [{ x: posX_ultima, y: posY_ultima }, pos];

        if (boliPintando) {
            visorTrazado.trazado.color = "blue";
            visorTrazado.trazado.grosor = 2;
        } else {
            visorTrazado.trazado.color = "lightgray";
            visorTrazado.trazado.grosor = 1;
        }

        visorTrazado.dibujarTrazado(trazado);

        posX_ultima = pos.x;
        posY_ultima = pos.y;
    }
}

/**
 * Actualiza el modo de movimiento (relativo o absoluto) segun el mensaje recibido
 * @param {string} mensaje 
 */
export function actualizaMovimientoRelativo(mensaje) {
    // aqui se recibe G91 o G90 o null
    const comando = parseadorMensajes.parsearMovimientoRelativo(mensaje);
    if (comando === "G91") {
        movimientoRelativo = true;
    } else if (comando === "G90") {
        movimientoRelativo = false;
    }
}

/**
 * Dibuja la posicion target del cabezal en verde
 * @param {{x:number, y:number}} mensaje 
 */
export function dibujarTarget({ x, y }) {
    visorCabezal.dibujarCabezal({ x: x, y: y }, "green");
}

/**
 * Actualiza el estado del boli (pintando o no pintando) segun el mensaje recibido
 * @param {string} mensaje 
 */
export function actualizarPosicionBoli(mensaje) {

    const comandoBoli = parseadorMensajes.parsearPosicionBoli(mensaje);
    console.log("El mensaje en actualizarPosicionBoli es: " + mensaje);
    console.log("El mensaje parseado en actualizarPosicionBoli es: " + comandoBoli);
    if (comandoBoli === "M1") {
        boliPintando = false;
    } else if (comandoBoli === "M2") {
        boliPintando = true;
    }
    console.log("Estado boli: " + (boliPintando ? "pintando" : "no pintando"));
}

/**
 * Dibuja el borde en color naranja en el que se ha pulsado el final de carrera
 * @param {string} mensaje recibe un mensaje con una opcion entre Xmin | Xmax | Ymin | Ymax
 */
export function alertaMargenFinalDeCarrera(mensaje) {
    visorTrazado.trazado.color = "orange";
    visorTrazado.trazado.grosor = 15;
    const eje = parseadorMensajes.parsearParadaFinalDeCarrera(mensaje);

    console.log("El mensaje en alertaMargenFinalDeCarrera es: " + mensaje);

    // Obtenemos las coordenadas minimas y maximas del canvas
    let xmin = visorTrazado.canvasManager.xmin;
    let xmax = visorTrazado.canvasManager.xmax;
    let ymin = visorTrazado.canvasManager.ymin;
    let ymax = visorTrazado.canvasManager.ymax;

    // Construimos el segmento de borde
    let bordeIzquierdo = [{ x: xmin, y: ymin }, { x: xmin, y: ymax }];
    let bordeDerecho = [{ x: xmax, y: ymin }, { x: xmax, y: ymax }];
    let bordeSuperior = [{ x: xmin, y: ymax }, { x: xmax, y: ymax }];
    let bordeInferior = [{ x: xmin, y: ymin }, { x: xmax, y: ymin }];


    if (eje === "Xmin") {
        visorTrazado.dibujarTrazado(bordeIzquierdo);

    } else if (eje === "Xmax") {
        visorTrazado.dibujarTrazado(bordeDerecho);

    } else if (eje === "Ymin") {
        visorTrazado.dibujarTrazado(bordeInferior);

    } else if (eje === "Ymax") {
        visorTrazado.dibujarTrazado(bordeSuperior);

    }
}

export function actualizarSetaParadaEmergencia(mensaje) {
    const estado = parseadorMensajes.parsearParadaEmergencia(mensaje);

    window.estaParadoPorEmergencia = (estado === "true");
    console.log("El mensaje en actualizarSetaParadaEmergencia es: " + mensaje);
    console.log("Estado de la parada de emergencia: " + estado);
    
    // Actualizamos el boton
    //
    const seta = document.getElementById("setaParadaEmergencia");

    if (estado === "true") {
        seta.classList.remove('btn-danger');
        seta.classList.add('btn-primary');
        seta.textContent = 'REANUDAR';
    } else if (estado === "false") {
        seta.classList.remove('btn-primary');
        seta.classList.add('btn-danger');
        seta.textContent = 'PARADA DE EMERGENCIA';
    }
}

export function recibirMensajeInformativo(mensaje){
    const  datos = parseadorMensajes.parsearInformacionGeneral(mensaje);
    console.log("Mensaje informativo recibido: " + datos);

    visorCabezal.dibujarCabezal(datos.pos_actual, "blue");
    posX_ultima = datos.pos_actual.x;
    posY_ultima = datos.pos_actual.y;

    Alpine.store('menu').posX = datos.pos_actual.x;
    Alpine.store('menu').posY = datos.pos_actual.y;

    window.estaParadoPorEmergencia = datos.parada_emergencia;

}

export function previsualizarGcode(){
    console.log("Previsualizando Gcode...");
    const archivoSeleccionado = document.querySelector('#listaArchivos a.active');
    if (!archivoSeleccionado) {
        alert("Necesitas seleccionar un archivo G-code primero.");
        return;
    }

    console.log("Previsualizando archivo:", archivoSeleccionado.textContent);
}

// Exponer la función para que pueda ser llamada desde scripts en el HTML 
window.previsualizarGcode = previsualizarGcode