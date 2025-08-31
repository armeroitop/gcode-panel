import { routes } from './routes.js';
console.log('se ha cargado el archivo app.js');

// Set global para los tags de scripts dinámicos ya añadidos
const scriptTagsCargados = new Set();

async function router() {
    const hash = location.hash.slice(1) || '/';
    const view = routes[hash] || (() => `<h1>401</h1>`);

    // view() ahora devuelve { html, scripts, scriptsModules }
    const result = await view();

    // 1. Insertamos el HTML en el contenedor
    const container = document.getElementById('app');
    container.innerHTML = result.html;


    // 2. Ejecutamos los scripts extraídos
    // Mejora de la gestión de scripts para evitar duplicados
    // ahora result.scripts es un array de objetos {tag, code} y debo comprobar en un List si 
    // ya existe ese tag antes de añadirlo a la vista
    // si lo añado, lo añado al List para futuras comprobaciones

    const contenedorScripts = document.getElementById('scripts_dimanicos');
    result.scripts.forEach(({ tag, code }) => {
        if (!scriptTagsCargados.has(tag)) {
            const script = document.createElement('script');
            script.type = 'text/javascript'; // No uses import/export en los <script> dinámicos
            script.text = code;
            contenedorScripts.appendChild(script);
            scriptTagsCargados.add(tag); // Añadir el tag al Set para futuras comprobaciones
            console.log(`Renderiza el script con tag "${tag}".`);
        } else {
            console.log(`El script con tag "${tag}" ya ha sido cargado, se omite.`);
        }
    });

    // 3. Cargamos los módulos si es necesario    
    for (const rutaScript of result.scriptsModules) {
        try {
            // Import dinámico del módulo
            const module = await import(rutaScript);
            //const module = await import(rutaScript + "?t=" + Date.now());
            // Si el módulo tiene una función init, la ejecutamos
            console.log(`Módulo importado: ${rutaScript}`, module);
            if (typeof module.init === "function") {
                module.init();
                console.log(`Módulo importado y función init() ejecutada: ${rutaScript}`);
            }
        } catch (err) {
            console.error(`Error al importar el módulo: ${rutaScript}`, err);
        }
    }


    document.dispatchEvent(new Event("routerRecargado"));
    document.dispatchEvent(new Event(hash));
}

window.addEventListener('hashchange', router);
window.addEventListener('load', router);
