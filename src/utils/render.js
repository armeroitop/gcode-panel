import { cargarVista } from './cargarVista.js';


// Reemplazo con soporte para componentes: {{> componente }} <script> {{# script }} y {{clave}}
export async function render(vista, data = {}) {

    // 1. Reemplazar componentes {{> componente }}
    const componenteRegex = /{{>\s*(\w+)\s*}}/g;
    let resultado = vista.html;

    let match;
    while ((match = componenteRegex.exec(resultado)) !== null) {
        const nombreComponente = match[1];
        const ruta = `views/components/${nombreComponente}.html`;

        try {
            let htmlComponente = await cargarVista(ruta);
            htmlComponente = htmlComponente.html;
            // TODO: Si encuentras etiquetas <script> dentro del componente se debe agregar una propiedad
            // como un tag=nombreComponente unico para luego cargarlo en el paso 2.
            let contador = 0;
            htmlComponente = htmlComponente.replace(
                /<script\b/gi,
                () => `<script tag="${nombreComponente}_${++contador}"`);

            resultado = resultado.replace(match[0], htmlComponente);
        } catch (err) {
            console.warn(`No se pudo cargar el componente: ${nombreComponente}`);
            resultado = resultado.replace(match[0], '');
        }
    }



    // 2. Capturar <script> y cargar scripts dinámicamente
    let contador = 0;
    resultado = resultado.replace(
        /<\s*script\s*>/gi,
        () => `<script tag="${vista.url}_${++contador}">`);

    const scripts = [];
    // Capturar el atributo tag para evitar duplicados y pasarlos al array de scripts 
    // como un array asociativo {tag: codigo}
    resultado = resultado.replace(
        /<script\b[^>]*\btag="([^"]+)"[^>]*>([\s\S]*?)<\/script>/gi,
        (match, tag, code) => {
            scripts.push({ tag, code: code.trim() });
            return ''; // eliminamos del HTML para que no se duplique
        }
    );


    // 3. Cargar scripts modules {{# script}}
    const scriptsModules = [];
    const scriptRegex = /{{#\s*(\w+)\s*}}/;
    let scriptMatch = '';
    while ((scriptMatch = scriptRegex.exec(resultado)) !== null) {
        const nombreScript = scriptMatch[1];
        const rutaScript = `./js/${nombreScript}.js`;

        // Cargar el script dinámicamente
        if (!document.querySelector(`script[src="${rutaScript}"]`)) {
            try {
                // Verifica si el archivo existe con fetch
                const head = await fetch(rutaScript, { method: 'HEAD' });
                
                if (head.ok) {
                    console.log(`Cargando script: ${rutaScript}`);
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

    // 4. Reemplazar variables {{clave}}
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