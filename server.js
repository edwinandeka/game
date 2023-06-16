const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const base64url = require('base64-url');


function makeid(length) {
    var result = "";
    var characters =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
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
        // Verificar si la sala existe
        if (rooms.hasOwnProperty(roomId)) {
            // Agregar al jugador a la sala existente
            rooms[roomId].push({ id: socket.id, name: playerName });
            socket.join(roomId);
            socket.emit('roomJoined', roomId);
         console.log('roomJoined', roomId);
        io.to(roomId).emit('playerList', rooms[roomId]); // Enviar lista de jugadores a todos en la sala
        } else {
            socket.emit('roomNotFound');
        }
    });

    // Cuando un jugador crea una nueva sala
    socket.on('createRoom', (playerName) => {
        
        const roomId = makeid(8); // Generar un ID único para la sala
        // const roomId = uuidv4(); // Generar un ID único para la sala
        // const roomCode = base64url.encode(roomId); // Codificar el ID de sala en un código
        const roomCode = roomId; // Codificar el ID de sala en un código


        // Crear la sala y agregar al jugador como el primer miembro
        rooms[roomId] = [{ id: socket.id, name: playerName }];
        socket.join(roomId);
        console.log('roomCreated', roomCode);
        socket.emit('roomCreated', roomCode);
    });
});

// Iniciar el servidor
const port = 3000; // Puedes cambiar el número de puerto si es necesario
http.listen(port, () => {
    console.log(`Servidor en funcionamiento en http://localhost:${port}`);
});
