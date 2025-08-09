<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');


ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


// Cargar controladores
require_once 'core/Router.php';
require_once 'controllers/archivosgcodeApi.php';
require_once 'controllers/usuariosApi.php';
//require_once 'controllers/utilidades.php';


$router = new Router();

// Rutas archivos G-code
$router->add('GET', '/api/archivosgcode/show', [ArchivosGcodeController::class, 'show']);
$router->add('POST', '/api/archivosgcode/upload', [ArchivosGcodeController::class, 'upload']);
$router->add('DELETE', '/api/archivosgcode/delete', [ArchivosGcodeController::class, 'delete']);


// Rutas usuarios
$router->add('GET', '/api/usuarios/show', [UsuariosController::class, 'show']);

$router->add('GET', '/api/ping', 'responderPing');

$router->dispatch($_SERVER['REQUEST_METHOD'], $_SERVER['REQUEST_URI']);