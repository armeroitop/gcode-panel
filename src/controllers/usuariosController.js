import { cargarVista } from '../utils/cargarVista.js';
import { render } from '../utils/render.js';


export async function usuariosController() {

    const vista = await cargarVista('views/usuarios.html');

    const datosRes = await fetch('/api/usuarios.php');
    const usuarios = await datosRes.json();

    const contenido = usuarios.map(u => `<li>${u.nombre}</li>`).join('');

    return render(vista, {
        titulo: 'Lista de Usuarios',
        contenido: `<ul>${contenido}</ul>`
    });
}
