<?php
// Arranca el servidor WebSocket, que estará a la escucha de las conexiones desde los navegadores.
// Ejecuta est script con "$ sudo php server/server.php"

require __DIR__ . '/vendor/autoload.php';

use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;
use Ratchet\Server\IoServer;
use React\EventLoop\Loop;
use React\Socket\SocketServer;

require_once 'RatchetServer.php';

$loop = Loop::get();
$ratchetServer = new RatchetServer($loop);
$socket = new SocketServer('0.0.0.0:8080', [], $loop);

$server = new IoServer(
    new HttpServer(
        new WsServer($ratchetServer)
    ),
    $socket,
    $loop
);
echo "Servidor WebSocket escuchando en el puerto 8080...\n";
$loop->run();

//$server->run();
