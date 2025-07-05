/*
 * @module  Select_player - [Descripción de la vista]
 *
 * @author [correo] ([Nombre Completo])
 *
 * @license Derechos Reservados de Autor (C) DOWESOFT (dowesoft.com)
 */

Titan.modules.create({
    name: 'Select_player',
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

        playersNames = [
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

        this.playerName.text(playersNames[selectedPlayerIndex]);

        let preloadPlayer = function () {
            // Carga la hoja de sprites del jugador
            players.forEach((p) =>
                this.load.spritesheet(p, `assets/${p}.png`, {
                    frameWidth: 16,
                    frameHeight: 24,
                })
            );
        };

        let player;

        let createPlayer = function () {
            // this.physics.world.createDebugGraphic();

            this.cameras.main.setBackgroundColor('#ffffff');

            players.forEach((p) =>
                this.anims.create({
                    key: p,
                    frames: this.anims.generateFrameNumbers(p, {
                        frames: [4, 5, 6, 7],
                    }),
                    frameRate: 10,
                    repeat: -1,
                })
            );

            player = this.physics.add.sprite(75, 70, 'player');
            player.setSize(8, 15);
            player.setScale(7);
            player.setOffset(3, 9);
            player.setCollideWorldBounds(true);
        };

        let updatePlayer = function () {
            player.anims.play(players[selectedPlayerIndex], true);
        };

        const configPlayer = {
            width: 160,
            height: 200,
            type: Phaser.AUTO,
            antialias: true,
            parent: 'animation-container',
            physics: {
                default: 'arcade',
            },
            scale: {
                mode: Phaser.Scale.RESIZE,
                autoCenter: Phaser.Scale.CENTER_BOTH,
                zoom: 2, // Ajusta este valor para que se ajuste a tus necesidades
            },
            scene: {
                preload: preloadPlayer,
                create: createPlayer,
                update: updatePlayer,
            },
        };

        setTimeout(() => {
            let game = new Phaser.Game(configPlayer);

            socket.once('startGame', (players) => {
                game.destroy(true);
                socket.off('playerList');

                Titan.view('ui', 'gamepad');
            });
        }, 400);

        socket.emit('selectPlayer', selectedPlayerIndex, roomCode);

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
    },

    /**
     * @name back
     * @description [descripción de la funcion]
     * @return {void}
     */
    back: function (params) {
        if (selectedPlayerIndex == 0) {
            selectedPlayerIndex = 11;
        } else {
            selectedPlayerIndex--;
        }

        this.playerName.text(playersNames[selectedPlayerIndex]);

        let roomCode = localStorage.getItem('roomCode');

        socket.emit('selectPlayer', selectedPlayerIndex, roomCode);
    },

    /**
     * @name next
     * @description [descripción de la funcion]
     * @return {void}
     */
    next: function (params) {
        if (selectedPlayerIndex == 11) {
            selectedPlayerIndex = 0;
        } else {
            selectedPlayerIndex++;
        }
        this.playerName.text(playersNames[selectedPlayerIndex]);

        let roomCode = localStorage.getItem('roomCode');

        socket.emit('selectPlayer', selectedPlayerIndex, roomCode);
    },

    /**
     * @name start
     * @description [descripción de la funcion]
     * @return {void}
     */
    start: function () {
        let roomCode = localStorage.getItem('roomCode');
        socket.off('playerList');
        socket.emit('startGame', roomCode);

        this.waitingRoom.addClass('selected')
        this.selectButton.hide()
    },

    /**
     * @name selectPlayer
     * @description [descripción de la funcion]
     * @return {void}
     */
    selectPlayer: function () {},
});
