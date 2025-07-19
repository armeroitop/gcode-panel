import { routes } from './routes.js';
console.log('se ha cargado el archivo app.js');

async function router() {
    const hash = location.hash.slice(1) || '/';
    const view = routes[hash] || (() => `<h1>401</h1>`);
    document.getElementById('app').innerHTML = await view();
}

window.addEventListener('hashchange', router);
window.addEventListener('load', router);
