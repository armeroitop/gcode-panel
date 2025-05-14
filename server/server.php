<?php
// Arranca el servidor WebSocket, que estará a la escucha de las conexiones desde los navegadores.
// Ejecuta est script con "$ sudo php server/server.php"

require __DIR__ . '/vendor/autoload.php';

use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;
use Ratchet\Server\IoServer;

require_once 'RatchetServer.php';

$server = IoServer::factory(
    new HttpServer(
        new WsServer(
            new RatchetServer()
        )
    ),
    8080
);

echo "Servidor WebSocket escuchando en el puerto 8080...\n";
$server->run();
