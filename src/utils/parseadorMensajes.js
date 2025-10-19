/**
 * Parsea un mensaje de posición tipo "Posicion actual: (x, y)"
 * @param {string} mensaje
 * @returns {{x: number, y: number} | null}
 */
export function parsearPosicion(mensaje) {
    if (mensaje.startsWith("Posicion actual:")) {
        const partes = mensaje.split(": ");
        if (partes.length === 2) {
            const coordenadas = partes[1].replace(/[()]/g, "").split(", ");
            if (coordenadas.length === 2) {
                const posX = parseFloat(coordenadas[0]);
                const posY = parseFloat(coordenadas[1]);
                if (!isNaN(posX) && !isNaN(posY)) {
                    return { x: posX, y: posY };
                }
            } else {
                console.error("Formato de coordenadas incorrecto:", partes[1]);
            }
        } else {
            console.error("Mensaje de posición mal formado:", mensaje);
        }
    }
    return null;
}

/**
 * Parsea un mensaje de error tipo "ERROR: descripción"
 * @param {string} mensaje
 * @returns {string|null}
 */
export function parsearError(mensaje) {
    if (mensaje.startsWith("ERROR:")) {
        return mensaje.substring(6).trim();
    }
    return null;
}

/**
 * Parsea un mensaje de estado tipo "Estado: valor"
 * @param {string} mensaje
 * @returns {string|null}
 */
export function parsearEstado(mensaje) {
    if (mensaje.startsWith("Estado:")) {
        return mensaje.split(":")[1]?.trim() ?? null;
    }
    return null;
}


/**
 * Parsea un mensaje de movimiento relativo o absoluto "G91" o "G90"
 * @param {string} mensaje
 * @returns {string|null}
 */
export function parsearMovimientoRelativo(mensaje) {
    //TODO: El mensaje que recibe tiene este formato [Executor] Ejecutando: G91
    if (mensaje.startsWith("[Executor] Ejecutando:")) {
        const comando = mensaje.split(":")[1]?.trim() ?? null;
        if (comando === "G91" || comando === "G90") {
            return comando;
        } else {
            return null;
        }
    }
}

/**
 * Parsea un mensaje de comando ejecutado tipo "[Executor] Ejecutando: G1 X10 Y10"
 * @param {string} mensaje
 * @returns {string|null}
 */
export function parsearMovimientoEnEjecucion(mensaje) {
    if (mensaje.startsWith("[Executor] Ejecutando:")) {
        const comando = mensaje.split(":")[1]?.trim() ?? null;
        if (comando.startsWith("G1")
            || comando.startsWith("G01")
            || comando.startsWith("G00")) {
            // TODO: Extraer de X e Y los valores y retornarlos como objeto {x: number, y: number}
            const partes = comando.split(" ");
            let x = null;
            let y = null;
            for (const parte of partes) {
                if (parte.startsWith("X")) {
                    x = parseFloat(parte.substring(1));
                } else if (parte.startsWith("Y")) {
                    y = parseFloat(parte.substring(1));
                }
            }
            if (x !== null && y !== null && !isNaN(x) && !isNaN(y)) {
                return { x: x, y: y };
            } else {
                console.error("No se pudieron parsear las coordenadas X e Y del comando:", comando);
                return null;
            }

        }
    }
    return null;
}


/**
 * Parsea un mensaje de comando ejecutado tipo "[Executor] Linea interpretada: M1"
 * @param {string} mensaje
 * @returns {string|null}
 */
export function parsearPosicionBoli(mensaje) {
    if (mensaje.startsWith("[Executor] Linea interpretada:")
        || mensaje.startsWith("[ServoBoli] metodo:")) {
    
        const comando = mensaje.split(":")[1]?.trim() ?? null;

        if (comando.startsWith("M1")) {
            // Boli arriba
            return "M1";
        } else if (comando.startsWith("M2")) {
            // Boli abajo
            return "M2";
        } else {
            return null;
        }
    }
}

export function parsearComandoGenerico(mensaje) {
    if (mensaje.startsWith("[Executor] Ejecutando:")) {
        return mensaje.split(":")[1]?.trim() ?? null;
    } else if (mensaje.startsWith("[Executor] Linea interpretada:")) {
        return mensaje.split(":")[1]?.trim() ?? null;
    }
    return null;
}

/**
 * Parsea un mensaje de parada por final de carrera
 *  tipo "[Parada] Final de carrera: Xmin | Xmax | Ymin | Ymax"
 * @param {string} mensaje
 * @returns {string|null}
 */
export function parsearParadaFinalDeCarrera(mensaje) {
    if (mensaje.startsWith("[Parada] Final de carrera:")) {
        return mensaje.split(":")[1]?.trim() ?? null;
    }
}

/**
 * Parsea un mensaje de parada por emergencia
 *  tipo "[Parada] Emergencia: true | false "
 * @param {string} mensaje
 * @returns {string|null}
 */
export function parsearParadaEmergencia(mensaje) {
    if (mensaje.startsWith("[Parada] Emergencia:")) {
        return mensaje.split(":")[1]?.trim() ?? null;
    }
}

/**
 * Parsea un mensaje con informacion de posicion, de parada, etc
 * @param {*} mensaje 
 * @returns devuelve un objeto con esta forma {  pos_actual: { x: 0, y: 0 },
 *                                               vel_unit_max: 0,
 *                                               vel_ang_max: 0.0001,
 *                                               parada_emergencia: false,
 *                                               u_final_carrera: ""}
 * 
 */
export function parsearInformacionGeneral(mensaje) {

    if (!mensaje.startsWith("Informacion General:")) return null;

    // Quitar la parte inicial
    let info = mensaje.replace("Informacion General:", "").trim();

    // Separar por ';' cada campo
    let campos = info.split(";").map(c => c.trim()).filter(c => c.length > 0);

    // Crear objeto vacío
    let datos = {};

    campos.forEach(campo => {
        // Separar por ':' la clave y el valor
        let [clave, valor] = campo.split(":").map(s => s.trim());

        if (clave && valor !== undefined) {
            // Si es la posición, convertir a objeto {x, y}
            if (clave === "pos_actual") {
                // Quitar paréntesis y separar por coma
                let match = valor.match(/\(([^,]+),\s*([^)]+)\)/);
                if (match) {
                    datos[clave] = {
                        x: parseFloat(match[1]),
                        y: parseFloat(match[2])
                    };
                    return; // ya asignado, saltar al siguiente campo
                }
            }

            // Convertir valores booleanos o numéricos
            if (!isNaN(valor)) {
                valor = parseFloat(valor);
            } else if (valor === "true") {
                valor = true;
            } else if (valor === "false") {
                valor = false;
            }

            datos[clave] = valor;
        }
    });

    return datos;
}