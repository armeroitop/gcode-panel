import { cargarVista } from './cargarVista.js';



// Reemplazo con soporte para componentes: {{> componente }} {{# script }} y {{clave}}
export async function render(template, data = {}) {

    // 1. Reemplazar componentes {{> componente }}
    const componenteRegex = /{{>\s*(\w+)\s*}}/g;
    let resultado = template;

    let match;
    while ((match = componenteRegex.exec(resultado)) !== null) {
        const nombreComponente = match[1];
        const ruta = `views/components/${nombreComponente}.html`;

        try {
            const htmlComp = await cargarVista(ruta);
            resultado = resultado.replace(match[0], htmlComp);
        } catch (err) {
            console.warn(`No se pudo cargar el componente: ${nombreComponente}`);
            resultado = resultado.replace(match[0], '');
        }
    }

    // 2. Capturar <script> y cargar scripts dinámicamente
    const scripts = [];
    resultado = resultado.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gi, (match, code) => {
        scripts.push(code.trim());
        return ''; // eliminamos del HTML para que no se duplique
    });

    /*scripts.forEach(code => {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.text = code;  // inserta el contenido del script
        document.body.appendChild(script); // lo añade al DOM y se ejecuta
    });*/

    // 2. Cargar scripts {{# script}}
    const scriptsModules = [];
    const scriptRegex = /{{#\s*(\w+)\s*}}/g;
    let scriptMatch;
    while ((scriptMatch = scriptRegex.exec(resultado)) !== null) {
        const nombreScript = scriptMatch[1];
        const rutaScript = `js/${nombreScript}.js`;

        // Cargar el script dinámicamente
        if (!document.querySelector(`script[src="${rutaScript}"]`)) {
            try {
                // Verifica si el archivo existe con fetch
                const head = await fetch(rutaScript, { method: 'HEAD' });
                if (head.ok) {
                    /*const script = document.createElement('script');
                    script.src = rutaScript;
                    script.type = 'module';
                    document.body.appendChild(script);*/
                    console.log(`Cargando script: ${rutaScript}`);
                    
                    // TODO: Obtener el contenido del script y añadirlo al array
                    //const script = await fetch(rutaScript).then(res => res.text());
                    //const response = await fetch(rutaScript);
                    //const script = await response.text();
                    scriptsModules.push(rutaScript); // Añade el contenido del script al array
                    

                } else {
                    console.warn(`El script no existe: ${rutaScript}`);
                }
            } catch (err) {
                console.warn(`Error al verificar el script: ${rutaScript}`);
            }
        }

        // Elimina la expresión del template
        resultado = resultado.replace(scriptMatch[0], '');
    }

    // 3. Reemplazar variables {{clave}}
    resultado = resultado.replace(/{{\s*([\w.]+)\s*}}/g, (_, ruta) => {
        const partes = ruta.split('.');
        let valor = data;
        for (const parte of partes) {
            valor = valor?.[parte];
            if (valor === undefined) break;
        }
        return valor ?? '';
    });

    //return resultado;
    return {
        html: resultado,
        scripts: scripts,
        scriptsModules: scriptsModules
    };


}