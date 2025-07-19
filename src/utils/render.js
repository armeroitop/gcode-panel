import { cargarVista } from './cargarVista.js';



// Reemplazo con soporte para componentes: {{> componente }} y {{clave}}
export async function render(template, data = {}) {
    // 1. Reemplazar componentes {{> componente }}
    const componenteRegex = /{{>\s*(\w+)\s*}}/g;
    let resultado = template;

    let match;
    while ((match = componenteRegex.exec(template)) !== null) {
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

     // 1b. Cargar scripts {{# mijavascript}}
    const scriptRegex = /{{#\s*(\w+)\s*}}/g;
    let scriptMatch;
    while ((scriptMatch = scriptRegex.exec(template)) !== null) {
        const nombreScript = scriptMatch[1];
        const rutaScript = `js/${nombreScript}.js`;

        // Cargar el script dinámicamente
        if (!document.querySelector(`script[src="${rutaScript}"]`)) {
            const script = document.createElement('script');
            script.src = rutaScript;
            script.type = 'module'; // o 'text/javascript' según tu caso
            document.body.appendChild(script);
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