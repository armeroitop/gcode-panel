<?php
//Script PHP para manejar la subida de archivos G-code.

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['gcodefile'])) {
    $uploadDir = __DIR__ . '/../uploads/';

    // Asegurarse de que el directorio exista
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    $fileTmpPath = $_FILES['gcodefile']['tmp_name'];
    $fileName = basename($_FILES['gcodefile']['name']);
    $destPath = $uploadDir . $fileName;

    if (move_uploaded_file($fileTmpPath, $destPath)) {
        echo "Archivo subido correctamente: $fileName";
    } else {
        echo "Error al mover el archivo.";
    }
} else {
    echo "No se recibió ningún archivo.";
}
