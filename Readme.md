
# Instrucciones para levantar el proyecto

## 1. Levantar la página web

Para iniciar el servidor web integrado de PHP:

```bash
cd src
php -S 0.0.0.0:8000
```

Esto iniciará el servidor en la dirección `http://0.0.0.0:8000`. Asegúrate de estar ubicado en el directorio `src` antes de ejecutar el comando.

## 2. Levantar el servicio WebSocket con Ratchet

Para iniciar el servidor WebSocket:

```bash
cd server
sudo php server.php
```

Esto iniciará el servidor WebSocket usando Ratchet. Es posible que se requieran permisos de superusuario dependiendo de tu configuración de red.

---

