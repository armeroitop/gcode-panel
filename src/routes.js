import { inicioController } from './controllers/inicioController.js';
import { usuariosController } from './controllers/usuariosController.js';

//const inicioController = new InicioController();

export const routes = {
    '/': () => inicioController.index(),
    '/usuarios':    usuariosController,
};
