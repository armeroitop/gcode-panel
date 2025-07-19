<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

echo json_encode([
  ['id' => 1, 'nombre' => 'Juan'],
  ['id' => 2, 'nombre' => 'Laura']
]);
