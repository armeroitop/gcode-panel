<?php

class ParametrosController {
    // Mostrar parámetros de configuración
    private string $parametrosFile = '/home/david/Proyectos/plotter/src/include/parametros.json';


    function show() {
        
        if (!file_exists($this->parametrosFile)) {
            http_response_code(500);
            echo json_encode(['error' => 'Archivo de parametros no encontrado']);
            return;
        }

        $configData = file_get_contents($this->parametrosFile);
        return json_decode($configData, true);
    }

    function update() {
        // Leer el cuerpo de la solicitud (espera JSON)
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);

        if ($data === null) {
            http_response_code(400);
            echo json_encode(['error' => 'JSON inválido']);
            return;
        }

        // Verificar que el archivo exista
        if (!file_exists($this->parametrosFile)) {
            http_response_code(500);
            echo json_encode(['error' => 'Archivo de parámetros no encontrado']);
            return;
        }

        // Cargar el archivo actual
        $configData = json_decode(file_get_contents($this->parametrosFile), true);

        if (!is_array($configData)) {
            $configData = [];
        }

        // Actualizar solo las claves permitidas
        $allowedKeys = ['velocidadMax', 'aceleracion', 'puertoSerie', 'ancho_mm', 'alto_mm'];
        foreach ($allowedKeys as $key) {
            if (isset($data[$key])) {
                $configData[$key] = $data[$key];
            }
        }

        // Guardar los cambios en el archivo
        $json = json_encode($configData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

        if (file_put_contents($this->parametrosFile, $json) === false) {
            http_response_code(500);
            echo json_encode(['error' => 'No se pudo escribir en el archivo de parámetros']);
            return;
        }

        // Respuesta de éxito
        http_response_code(200);
        return json_encode(['message' => 'Parámetros actualizados correctamente', 'data' => $configData]);

        
    }
}