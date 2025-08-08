<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');


ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


// Cargar controladores
require_once 'core/Router.php';
require_once 'controllers/archivosgcode.php';
//require_once 'controllers/utilidades.php';

// Tabla de rutas
/*$routes = [
    'GET' => [
        '/api/archivosgcode/show'   => [ArchivosGcodeController::class, 'show'],
        '/api/archivosgcode/show2'  => [ArchivosGcodeController::class, 'show2'],
        '/api/ping'     => 'responderPing'
    ],
    'POST' => [
        '/api/archivos'    => 'subirArchivo'
    ]
];*/

/*

// Capturar método y ruta
$metodo = $_SERVER['REQUEST_METHOD'];
$ruta = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Comprobar si la ruta existe
if (isset($routes[$metodo][$ruta])) {
    $funcion = $routes[$metodo][$ruta];

    if (is_array($funcion) && count($funcion) === 2 && class_exists($funcion[0])) {
        $controlador = new $funcion[0]();
        $method = $funcion[1];
        if (is_callable([$controlador, $method])) {
            $resultado = call_user_func([$controlador, $method]);
            echo json_encode($resultado);
        } else {
            // error método no callable
        }
    } else if (is_callable($funcion)) {
        $resultado = call_user_func($funcion);
        echo json_encode($resultado);
    } else {
        // error función no callable
        echo json_encode(["error" => "La función '$funcion' no está definida."]);
    }
} else {
    http_response_code(404);
    echo json_encode(["error" => "Ruta no encontrada"]);
}
*/


$router = new Router();

$router->add('GET', '/api/archivosgcode/show', [ArchivosGcodeController::class, 'show']);
$router->add('GET', '/api/archivosgcode/show2', [ArchivosGcodeController::class, 'show2']);
$router->add('GET', '/api/ping', 'responderPing');
$router->add('POST', '/api/archivos', 'subirArchivo');

$router->dispatch($_SERVER['REQUEST_METHOD'], $_SERVER['REQUEST_URI']);