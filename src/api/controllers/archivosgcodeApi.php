<?php

// Opcional, para evitar que errores PHP se impriman y rompan el JSON
//error_reporting(E_ERROR | E_PARSE);

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

    function upload() {
        if (isset($_FILES['gcodefile'])) {
            $uploadDir = __DIR__ . '/../../../uploads/';

            // Asegurarse de que el directorio exista
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0755, true);
            }

            $fileTmpPath = $_FILES['gcodefile']['tmp_name'];
            $fileName = basename($_FILES['gcodefile']['name']);
            $destPath = $uploadDir . $fileName;

            if (move_uploaded_file($fileTmpPath, $destPath)) {
                //echo "Archivo subido correctamente: $fileName";
                return ["mensaje" => "Archivo subido correctamente: $fileName"];
            } else {
                //echo "Error al mover el archivo.";
                return ["mensaje" => "Error al mover el archivo."];
            }
        } else {
            //echo "No se recibió ningún archivo.";
            return ["mensaje" => "No se recibió ningún archivo."];
        }
    }

    function delete() {
        $data = $this->getJsonBody();
        $nombreArchivo = $data['nombre'] ?? null;

        if ($nombreArchivo) {
            $uploadDir = __DIR__ . '/../../../uploads/';
            $filePath = $uploadDir . $nombreArchivo;

            echo "La ruta de archivo" . $filePath;

            if (file_exists($filePath)) {
                if (unlink($filePath)) {
                    return ["mensaje" => "Archivo eliminado correctamente: $filePath"];
                } else {
                    return ["error" => "Error al eliminar el archivo."];
                }
            } else {
                return ["error" => "Archivo no encontrado."];
            }
        } else {
            return ["error" => "No se especificó ningún archivo para eliminar."];
        }
    }

    function getJsonBody() {
        static $json = null;
        if ($json === null) {
            $raw = file_get_contents('php://input');
            $json = json_decode($raw, true);
        }
        return $json;
    }
}

?>