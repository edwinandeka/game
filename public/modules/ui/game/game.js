/*
 * @module  Game - [Descripción de la vista]
 *
 * @author [correo] ([Nombre Completo])
 *
 * @license Derechos Reservados de Autor (C) DOWESOFT (dowesoft.com)
 */

Titan.modules.create({
    name: 'Game',
    /*
     * @constructor @description inicia los componentes del módulo
     */
    ready: function () {

        let roomCode = localStorage.getItem('roomCode');

		
        socket.emit('playerList', roomCode);
        socket.once('playerList', (players) => {
            console.log('playerList', players);

            window.players = players;
            console.log('juego iniciado ', players);
            let game = new Phaser.Game(config);
        });
    },
});
