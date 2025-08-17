import { inicioController } from './controllers/inicioController.js';
import { usuariosController } from './controllers/usuariosController.js';
import { configuracionController } from './controllers/configuracionController.js';

//const inicioController = new InicioController();

export const routes = {
    '/': () => inicioController.index(),
    '/usuarios':    usuariosController,
    '/configuracion': () => configuracionController.index(),
};
