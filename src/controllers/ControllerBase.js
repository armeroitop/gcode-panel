import { cargarVista } from '../utils/cargarVista.js';
import { render } from '../utils/render.js';


export class ControllerBase {

    constructor(parameters) {
    }

    cargarVista(ruta_vista) {
        return cargarVista(ruta_vista);
    }

    render(vista, data) {
        return render(vista, data);
    }
}