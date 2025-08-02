import { cargarVista } from './cargarVista.js';



// Reemplazo con soporte para componentes: {{> componente }} y {{clave}}
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

    // 1b. Cargar scripts {{# script}}
    const scriptRegex = /{{#\s*(\w+)\s*}}/g;
    let scriptMatch;
    while ((scriptMatch = scriptRegex.exec(template)) !== null) {
        const nombreScript = scriptMatch[1];
        const rutaScript = `js/${nombreScript}.js`;

        // Cargar el script dinámicamente
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
                console.warn(`Error al verificar el script: ${rutaScript}`);
            }
        }

        // Elimina la expresión del template
        resultado = resultado.replace(scriptMatch[0], '');
    }

    // 2. Reemplazar variables {{clave}}
    resultado = resultado.replace(/{{\s*([\w.]+)\s*}}/g, (_, ruta) => {
        const partes = ruta.split('.');
        let valor = data;
        for (const parte of partes) {
            valor = valor?.[parte];
            if (valor === undefined) break;
        }
        return valor ?? '';
    });

    return resultado;


}