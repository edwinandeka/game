/*
 * @module  Waiting_room - [Descripción de la vista]
 *
 * @author [correo] ([Nombre Completo])
 *
 * @license Derechos Reservados de Autor (C) DOWESOFT (dowesoft.com)
 */

Titan.modules.create({
    name: 'Waiting_room',
    /*
     * @constructor @description inicia los componentes del módulo
     */
    ready: function () {
        let roomCode = localStorage.getItem('roomCode');

        this.roomCode.text(roomCode);

        socket.emit('playerList', roomCode);
        socket.on('playerList', (players) => {
            console.log('playerList', players);

            window.players = players;
            console.log(players);
            playerList.innerHTML = '';
            players.forEach((player) => {
                const listItem = document.createElement('li');
                listItem.textContent = player.name;
                playerList.appendChild(listItem);
            });
        });

        socket.on('startGame', (players) => {
            socket.off('playerList');

            Titan.view('ui', 'game');
        });
    },
});
