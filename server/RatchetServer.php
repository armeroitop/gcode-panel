
<?php
// Contiene la lógica para manejar la conexión WebSocket.

require __DIR__ . '/vendor/autoload.php';

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;
use React\EventLoop\LoopInterface;

class RatchetServer implements MessageComponentInterface {
    protected $clients;
    protected $fifoPath = '/tmp/plotter_out';
    protected LoopInterface $loop;

    public function __construct(LoopInterface $loop) {
        $this->clients = new \SplObjectStorage();
        $this->loop = $loop;

        // Iniciar un hilo o bucle para leer el FIFO
        $this->startFifoListener();
    }

    public function onOpen(ConnectionInterface $conn) {
        $this->clients->attach($conn);

        echo "Nueva conexión: ({$conn->resourceId})\n";
    }

    public function onClose(ConnectionInterface $conn) {
        $this->clients->detach($conn);
        echo "Se cerró la conexión: ({$conn->resourceId})\n";
    }

    public function onMessage(ConnectionInterface $from, $msg) {
        echo "Mensaje recibido: $msg\n";

        // Si recibimos un comando para procesar el G-code
        if (strpos($msg, "procesar") !== false) {
            $nombreArchivo = substr($msg, strpos($msg, " ") + 1); // Extraemos el nombre del archivo
            echo "Nombre del archivo: $nombreArchivo\n";
            $resultado = $this->procesarArchivoGcode($nombreArchivo);
            $from->send("Archivo enviado: $nombreArchivo");
        }

        // Si recibimos un comando para procesar el G-code
        if (strpos($msg, "comando") !== false) {
            // Le extraemos la palabra clave y nos quedamos con el comando
            $comando = trim(substr($msg, strpos($msg, ' ') + 1));

            shell_exec("echo $comando > /tmp/gcode_pipe");
            $from->send("Comando enviado $comando");
        }
    }

    public function onError(ConnectionInterface $conn, \Exception $e) {
        echo "Error: {$e->getMessage()}\n";
        $conn->close();
    }

    private function startFifoListener() {
        $fifo = fopen($this->fifoPath, "r");

        if (!$fifo) {
            echo "No se pudo abrir el FIFO para lectura.\n";
            return;
        }

        echo "FIFO para lectura iniciado.\n";

        stream_set_blocking($fifo, false);

        $this->loop->addPeriodicTimer(0.1, function () use ($fifo) {
            while (($line = fgets($fifo)) !== false) {
                $line = trim($line);
                echo "[FIFO] $line\n";

                foreach ($this->clients as $client) {
                    $client->send($line);
                }
            }
        });
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
