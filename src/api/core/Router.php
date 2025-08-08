<?php

class Router
{
    private array $routes = [];

    // Añadir ruta
    public function add(string $method, string $path, callable|array|string $handler): void
    {
        $method = strtoupper($method);
        $this->routes[$method][$path] = $handler;
    }

    // Ejecutar ruta
    public function dispatch(string $method, string $uri): void
    {
        $method = strtoupper($method);
        $path = parse_url($uri, PHP_URL_PATH);

        if (!isset($this->routes[$method][$path])) {
            http_response_code(404);
            echo json_encode(['error' => 'Ruta no encontrada']);
            return;
        }

        $handler = $this->routes[$method][$path];

        // Resolver callable y ejecutarlo
        try {
            if (is_array($handler)) {
                [$class, $method] = $handler;
                if (!class_exists($class)) {
                    throw new Exception("Clase $class no encontrada");
                }
                $controller = new $class();
                if (!method_exists($controller, $method)) {
                    throw new Exception("Método $method no existe en $class");
                }
                $result = $controller->$method();
            } elseif (is_callable($handler)) {
                $result = call_user_func($handler);
            } else {
                throw new Exception("Handler inválido");
            }

            header('Content-Type: application/json');
            echo json_encode($result);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
}
