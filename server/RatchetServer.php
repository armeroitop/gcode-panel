
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
            echo "Nombre del archivo: $nombreArchivo\n";
            $resultado = $this->procesarArchivoGcode($nombreArchivo);
            $from->send("Resultado onMesseage: $resultado");
        }

        // Si recibimos un comando para procesar el G-code
        if (strpos($msg, "mover") !== false) {
            // Suponiendo que el mensaje es "mover -10 -10"
            $partes = explode(" ", $msg);
            // $partes[0] = "mover", $partes[1] = "-10", $partes[2] = "-10"
            $x = isset($partes[1]) ? $partes[1] : 0;
            $y = isset($partes[2]) ? $partes[2] : 0;

            shell_exec('echo "G91" > /tmp/gcode_pipe');
            shell_exec("echo \"G1 X$x Y$y\" > /tmp/gcode_pipe");
            $from->send("Movimiento realizado a X$x Y$y.");
        }
    }

    public function onError(ConnectionInterface $conn, \Exception $e) {
        echo "Error: {$e->getMessage()}\n";
        $conn->close();
    }

    // Función para procesar el G-code
    private function procesarArchivoGcode(string $nombreArchivo): ?string {
        $rutaArchivo = '/home/david/Proyectos/gcode-panel/uploads/' . $nombreArchivo;
        if (file_exists($rutaArchivo)) {
            // Ejecutamos el comando para procesar el archivo
            $comando = "echo @ " . escapeshellarg($rutaArchivo) . " > /tmp/gcode_pipe";
            echo "Comando a ejecutar: $comando\n";
            $output = shell_exec($comando);
            echo "Archivo procesado: $output\n";
            return $output;
        } else {
            echo "Archivo no encontrado.\n";
            return "Archivo no encontrado.";
        }
    }
}
