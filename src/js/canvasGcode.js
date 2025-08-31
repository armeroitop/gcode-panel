
class CanvasManager {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            throw new Error(`No se encontró el canvas con id: ${canvasId}`);
        }
        this.ctx = this.canvas.getContext("2d");
        this.scale = 2; // mm -> px, configurable
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
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

class Trayectoria {
    constructor(ctx, scale) {
        this.ctx = ctx;
        this.scale = scale;
    }

    dibujarTrayectoria(path) {
        if (path.length === 0) return;
        debugger;

        this.ctx.beginPath();
        this.ctx.moveTo(path[0].x * this.scale, path[0].y * this.scale);
        for (let i = 1; i < path.length; i++) {
            this.ctx.lineTo(path[i].x * this.scale, path[i].y * this.scale);
        }
        this.ctx.strokeStyle = "blue";
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    }
}

class Cabezal {
    constructor(ctx, scale) {
        this.ctx = ctx;
        this.scale = scale;
    }

    dibujarCabezal(pos) {
        this.ctx.fillStyle = "red";
        this.ctx.beginPath();
        this.ctx.arc(pos.x * this.scale, pos.y * this.scale, 5, 0, Math.PI * 2);
        this.ctx.fill();
    }
}


class GcodeVisualizer {
    constructor(canvasId) {
        this.canvasManager = new CanvasManager(canvasId);
        this.ejes = new Ejes(this.canvasManager.getContext(), this.canvasManager.getScale());
        this.trayectoria = new Trayectoria(this.canvasManager.getContext(), this.canvasManager.getScale());
        this.cabezal = new Cabezal(this.canvasManager.getContext(), this.canvasManager.getScale());
    }

    init() {
        this.canvasManager.clear();
        this.canvasManager.resize();
        this.ejes.dibujarEjes();
    }

    dibujarTrayectoria(path) {
        this.trayectoria.dibujarTrayectoria(path);
        if (path.length > 0) {
            this.cabezal.dibujarCabezal(path[path.length - 1]);
        }
    }
}







export function init() {
    
    const visualizer = new GcodeVisualizer("visorGcodeCanvas");
    visualizer.init();

    // Ejemplo de trayectoria
    const ejemploPath = [
        { x: 0, y: 0 },
        { x: 50, y: 50 },
        { x: 100, y: 50 }       
    ];
    visualizer.dibujarTrayectoria(ejemploPath);



}