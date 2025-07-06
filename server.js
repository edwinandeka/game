const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const base64url = require('base64-url');
const os = require('os');
const QRCode = require('qrcode');
const { log } = require('console');

// Función para obtener la dirección IP local
/**
 * Devuelve la IP asignada a la interfaz activa de red que sale a Internet.
 */
async function getLocalIP() {
  try {
    const gatewayModule = await import('default-gateway');

    // ✅ usamos gateway4async() desde .default
    const result = await gatewayModule.default.gateway4async();

    const ifaceName = result.int;

    const interfaces = os.networkInterfaces();
    const iface = interfaces[ifaceName];

    if (!iface) return null;

    for (const addr of iface) {
      if (addr.family === 'IPv4' && !addr.internal) {
        return addr.address;
      }
    }

    return null;
  } catch (error) {
    console.error('[getLocalIP] Error:', error);
    return null;
  }
}

//  generar un ID aleatorio para la sala
function makeid(length) {

    return "XXXX"
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZ';
    // 'ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        );
    }
    return result;
}

const rooms = {};

// Ruta de la carpeta pública
const publicPath = path.join(__dirname, 'public');

// Configurar el middleware para servir archivos estáticos
app.use(express.static(publicPath));

// Manejar la conexión de un cliente
io.on('connection', (socket) => {
    console.log('Un cliente se ha conectado');

    // Manejar eventos personalizados
    // Aquí puedes implementar la lógica específica de tu juego multijugador

    // Manejar la desconexión de un cliente
    // Cuando un jugador se desconecta o abandona la sala
    socket.on('disconnect', () => {
        // Buscar la sala a la que pertenece el jugador
        const room = Object.entries(rooms).find(([_, players]) =>
            players.some((player) => player.id === socket.id)
        );

        if (room) {
            const [roomId, players] = room;
            // Eliminar al jugador de la sala
            rooms[roomId] = players.filter((player) => player.id !== socket.id);
            socket.leave(roomId);
            io.to(roomId).emit('playerList', rooms[roomId]); // Enviar lista actualizada de jugadores a todos en la sala
        }
    });

    // Cuando un jugador solicita unirse a una sala
    socket.on('joinRoom', (roomId, playerName) => {
        console.log(rooms);
        // Verificar si la sala existe
        if (rooms.hasOwnProperty(roomId)) {
            // Agregar al jugador a la sala existente
            let player = {
                id: socket.id,
                name: playerName,
                controls: {
                    up: { isDown: false },
                    down: { isDown: false },
                    left: { isDown: false },
                    right: { isDown: false },
                    a: { isDown: false },
                    b: { isDown: false },
                    left: { isDown: false },
                    pause: { isDown: false },
                },
            };
            rooms[roomId].push(player);

            socket.player = player;
            socket.join(roomId);
            socket.emit('roomJoined', player);
            console.log('roomJoined', roomId);
            io.to(roomId).emit('playerList', rooms[roomId]); // Enviar lista de jugadores a todos en la sala
        } else {
            socket.emit('roomNotFound');
        }
    });

    // Cuando un jugador solicita la lista de jugadores de a una sala
    socket.on('playerList', (roomId) => {
        // Verificar si la sala existe
        if (rooms.hasOwnProperty(roomId)) {
            socket.emit('playerList', rooms[roomId]);
        } else {
            socket.emit('roomNotFound');
        }
    });

    // Cuando un jugador crea una nueva sala
    socket.on('createRoom', () => {
        const roomId = makeid(4); // Generar un ID único para la sala
        rooms[roomId] = [];
        socket.join(roomId);
        console.log('roomCreated', roomId);

        getLocalIP().then(async (localIP) => {

            const wsURL = `http://${localIP}:${port}/?roomId=${roomId}`;
            const url = `http://${localIP}:${port}`;

            // generar código QR
            const qrDataURL = await QRCode.toDataURL(wsURL);

            socket.emit('roomCreated', {
                roomId,
                qrCode: qrDataURL,
                wsURL,
                url,
            });
        });
    });

    socket.on('startGame', (roomId) => {
        console.log('startGame', roomId);
        socket.player.start = true;

        let accepted = rooms[roomId].map((p) => p.start).filter((r) => r);

        if (accepted.length == rooms[roomId].length) {
            io.to(roomId).emit('startGame', roomId);
        }
    });

    socket.on('selectPlayer', (selectedPlayerIndex, roomId) => {
        if (socket.player) {
            socket.player.selectedPlayerIndex = selectedPlayerIndex;
            io.to(roomId).emit('playerList', rooms[roomId]);
            io.to(roomId).emit('gamecontrols', rooms[roomId]);
        }
    });

    socket.on('controls', (buttons, roomId) => {
        if (socket.player) {
            socket.player.controls = buttons;
            io.to(roomId).emit('gamecontrols', rooms[roomId]);
        }
    });

    socket.on('menu', (roomId) => {
        rooms[roomId].forEach((p) => (p.start = false));
        io.to(roomId).emit('menu', socket.player.name);
    });
});

// Iniciar el servidor
const port = 3000; // Puedes cambiar el número de puerto si es necesario
http.listen(port, () => {
    console.log(`Servidor en funcionamiento en http://localhost:${port}`);
});
