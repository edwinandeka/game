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

        selectedPlayerIndex = 0;

        let players = [
            'player0',
            'player1',
            'player2',
            'player3',
            'player4',
            'player5',
            'player6',
            'player7',
            'player8',
            'player9',
            'player10',
            'player11',
            'player12',
        ];

        let playersNames = [
            'Blast',
            'Blaze',
            'Spark',
            'Frost',
            'Golem',
            'Venom',
            'Claw',
            'Vortex',
            'Specter',
            'Laser',
            'Acid',
            'Rock',
            'Shoot',
        ];

        socket.emit('playerList', roomCode);
        socket.on('playerList', (players) => {
            console.log(players);
            this.playerListContainer.empty();

            players.forEach((player) => {
                this.playerListContainer.append(`
                <li>
                    <div class="player-image" style="background-image: url(assets/player${player.selectedPlayerIndex}.png);" ></div> ${player.name} - <span>${playersNames[player.selectedPlayerIndex]}</span>
                </li>
            `);
            });
        });

        socket.once('startGame', (players) => {
            socket.off('playerList');

            Titan.view('ui', 'game');
        });
    },
});
