
<?php
// Contiene la lógica para manejar la conexión WebSocket.

require __DIR__ . '/vendor/autoload.php';

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

class RatchetServer implements MessageComponentInterface {
    public function onOpen(ConnectionInterface $conn) {
        echo "Nueva conexión: ({$conn->resourceId})\n";
    }

    public function onClose(ConnectionInterface $conn) {
        echo "Se cerró la conexión: ({$conn->resourceId})\n";
    }

    public function onMessage(ConnectionInterface $from, $msg) {
        echo "Mensaje recibido: $msg\n";

        // Si recibimos un comando para procesar el G-code
        if (strpos($msg, "procesar") !== false) {
            $nombreArchivo = substr($msg, strpos($msg, " ") + 1); // Extraemos el nombre del archivo
            $resultado = $this->procesarGcode($nombreArchivo);
            $from->send("Resultado onMesseage: $resultado");
        }
    }

    public function onError(ConnectionInterface $conn, \Exception $e) {
        echo "Error: {$e->getMessage()}\n";
        $conn->close();
    }

    // Función para procesar el G-code
    private function procesarGcode(string $nombreArchivo): ?string {
        $rutaArchivo = __DIR__ . '/../uploads/' . $nombreArchivo;
        if (file_exists($rutaArchivo)) {
            // Ejecutamos el comando para procesar el archivo
            $comando = escapeshellcmd("/home/david/Proyectos/plotter/plotter $rutaArchivo");
            $output = shell_exec($comando);
            echo "Archivo procesado: $output\n";
            return $output;
        } else {
            echo "Archivo no encontrado.\n";
            return "Archivo no encontrado.";
        }
    }
}
