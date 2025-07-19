import { cargarVista } from '../utils/cargarVista.js';
import { render } from '../utils/render.js';

/*export async function inicioController() {
    return await cargarVista('views/inicio.html');
}*/


export class InicioController {
    async index() {
        const vista = await cargarVista('views/inicio.html');
        return render(vista, {
            titulo: 'Inicio'
        });
    }
}

export const inicioController = new InicioController();