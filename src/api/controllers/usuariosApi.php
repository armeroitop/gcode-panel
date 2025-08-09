<?php
class UsuariosController {
    
    function show() {
        // Mostrar usuarios disponibles
        $usuarios = [
            ['id' => 1, 'nombre' => 'Juan'],
            ['id' => 2, 'nombre' => 'Laura']
        ];
        
        return $usuarios;
    }
}