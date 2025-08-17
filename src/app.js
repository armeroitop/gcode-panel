import { routes } from './routes.js';
console.log('se ha cargado el archivo app.js');

async function router() {
    const hash = location.hash.slice(1) || '/';
    const view = routes[hash] || (() => `<h1>401</h1>`);
    //document.getElementById('app').innerHTML = await view();

    // view() ahora devuelve { html, scripts }
    const result = await view();

    // 1. Insertamos el HTML en el contenedor
    const container = document.getElementById('app');
    container.innerHTML = result.html;


    // 2. Ejecutamos los scripts extraídos
    result.scripts.forEach(code => {
        const script = document.createElement('script');
        script.type = 'text/javascript';       // si usas import/export, sino 'text/javascript'
        script.text = code;
        container.appendChild(script);
    });

    // 3. Cargamos los módulos si es necesario
    result.scriptsModules.forEach(async (rutaScript) => {
        if (!document.querySelector(`script[src="${rutaScript}"]`)) {
            try {
                // Verifica si el archivo existe con fetch
                const response = await fetch(rutaScript, { method: 'HEAD' });
                if (response.ok) {
                    const script = document.createElement('script');
                    script.src = rutaScript;
                    script.type = 'module';
                    document.body.appendChild(script);
                } else {
                    console.warn(`El script no existe: ${rutaScript}`);
                }
            } catch (err) {
                console.error(`Error al cargar el script: ${rutaScript}`, err);
            }
        }
    });
}

window.addEventListener('hashchange', router);
window.addEventListener('load', router);
