import { ControllerBase } from "./ControllerBase.js";


export class ConfiguracionController extends ControllerBase {

    async index() {
        const vista = await this.cargarVista('views/configuracion.html');
        // Aquí podrías cargar datos de configuración si es necesario
        // Por ejemplo, podrías hacer una llamada a la API para obtener los parámetros actuales
        const datosRes = await fetch('/api/parametros/show');
        const parametros = await datosRes.json();

        return await this.render(vista, {
            titulo: 'Configuración',
            parametros: parametros,
        });
    }
}

export const configuracionController = new ConfiguracionController();