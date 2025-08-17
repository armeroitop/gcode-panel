<?php

class ParametrosController {
    function show() {
        // Mostrar parámetros de configuración
        $parametrosFile = '/home/david/Proyectos/plotter/src/include/parametros.json';

        if (!file_exists($parametrosFile)) {
            http_response_code(500);
            echo json_encode(['error' => 'Archivo de parametros no encontrado']);
            return;
        }

        $configData = file_get_contents($parametrosFile);
        return json_decode($configData, true);
    }

}