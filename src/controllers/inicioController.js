import { ControllerBase } from "./ControllerBase.js";

export class InicioController  extends ControllerBase {
    async index() {
        const vista = await this.cargarVista('views/inicio.html');
        return this.render(vista, {
            titulo: 'Inicio'
        });
    }
}

export const inicioController = new InicioController();