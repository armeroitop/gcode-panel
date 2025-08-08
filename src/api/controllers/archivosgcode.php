<?php

// Opcional, para evitar que errores PHP se impriman y rompan el JSON
//error_reporting(E_ERROR | E_PARSE);

//echo json_encode("Script PHP para manejar la subida de archivos G-code.");
class ArchivosGcodeController {
    function show() {
        // Mostrar archivos G-code disponibles
        $uploadDir = __DIR__ . '/../../../uploads/';

        // Asegurarse de que el directorio exista
        if (!is_dir($uploadDir)) {
            http_response_code(500);
            echo json_encode(['error' => 'Directorio de subida no encontrado']);
            return;
        }

        $files = scandir($uploadDir);
        $gcodeFiles = array_filter($files, function($file) use ($uploadDir) {
            return is_file($uploadDir . $file) && pathinfo($file, PATHINFO_EXTENSION) === 'gcode';
        });

        return array_values($gcodeFiles);
    }

    function show2() {
        return ["mensaje" => "Mostrando archivos GCode"];
    }
}



?>