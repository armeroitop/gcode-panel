
import {
    parsearPosicion,
    parsearMovimientoRelativo,
    parsearMovimientoEnEjecucion,
    parsearPosicionBoli
} from "../utils/parseadorMensajes.js";
class CanvasManager {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            throw new Error(`No se encontró el canvas con id: ${canvasId}`);
        }
        this.ctx = this.canvas.getContext("2d");
        this.scale = 2; // mm -> px, configurable

        // Aplicamos transformación para sistema cartesiano
        //this.ctx.translate(0, this.canvas.height);
        //this.ctx.scale(1, -1);
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

        // Marcas cada 10 unidades
        const step = 10 * this.scale;
        for (let x = centerX; x < width; x += step) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, centerY - 5);
            this.ctx.lineTo(x, centerY + 5);
            this.ctx.stroke();
        }
        for (let x = centerX; x > 0; x -= step) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, centerY - 5);
            this.ctx.lineTo(x, centerY + 5);
            this.ctx.stroke();
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
        }
        for (let y = centerY; y > 0; y -= step) {
            this.ctx.beginPath();
            this.ctx.moveTo(centerX - 5, y);
            this.ctx.lineTo(centerX + 5, y);
            this.ctx.stroke();
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
let movimientoRelativo = false;
let boliPintando = false;

export function init() {

    visorTrazado = new VisorTrazado("canvasTrazado");
    visorCabezal = new VisorCabezal("canvasCabezal");

    visorTrazado.init();
    visorCabezal.init();
}

export function dibujarCabezal(mensaje) {
    const pos = parsearPosicion(mensaje);
    if (pos) {
        visorCabezal.init();
        visorCabezal.dibujarCabezal(pos);
    }
}

export function actualizarPosicionTarget(mensaje) {
    // Comprobar si el movimiento a sido relativo o absoluto
    actualizaMovimientoRelativo(mensaje);

    // Dibujar el target de proxima posicion,
    // las coordenadas proximas serán: Si es m.relativo serán las ultimas mas el movimiento
    // y si son absolutas pues las que indica el comando G1 Xtal Ytal
    dibujarTarget(mensaje);
}

export function dibujarTrazado(mensaje) {    

    const pos = parsearPosicion(mensaje);
    if (pos) {
        const trazado = [{ x: posX_ultima, y: posY_ultima }, pos];

        if(boliPintando){
            visorTrazado.trazado.color = "blue";
            visorTrazado.trazado.grosor = 2;
        }else{
            visorTrazado.trazado.color = "lightgray";
            visorTrazado.trazado.grosor = 1;
        }

        visorTrazado.dibujarTrazado(trazado);

        posX_ultima = pos.x;
        posY_ultima = pos.y;
    }
}

export function actualizaMovimientoRelativo(mensaje) {
    // aqui se recibe G91 o G90 o null
    const comando = parsearMovimientoRelativo(mensaje);
    if (comando === "G91") {
        movimientoRelativo = true;
    } else if (comando === "G90") {
        movimientoRelativo = false;
    }
}

export function dibujarTarget(mensaje) {
    const posTarget = parsearMovimientoEnEjecucion(mensaje);
    if (posTarget) {
        let x, y;
        if (movimientoRelativo) {
            x = posX_ultima + posTarget.x;
            y = posY_ultima + posTarget.y;
        } else {
            x = posTarget.x;
            y = posTarget.y;
        }
        visorCabezal.dibujarCabezal({ x: x, y: y }, "green");
    }
}

export function actualizarPosicionBoli(mensaje) {
    const comandoBoli = parsearPosicionBoli(mensaje);
    console.log("El mensaje en actualizarPosicionBoli es: " + mensaje);
    console.log("El mensaje parseado en actualizarPosicionBoli es: " + comandoBoli);
    if (comandoBoli === "M1"){
        boliPintando = false;
    } else if (comandoBoli === "M2"){
        boliPintando = true;
    }
    console.log("Estado boli: " + (boliPintando ? "pintando" : "no pintando"));
}