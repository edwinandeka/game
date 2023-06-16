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
            console.log(players);
            playerList.innerHTML = '';
            players.forEach((player) => {
                const listItem = document.createElement('li');
                listItem.textContent = player.name;
                playerList.appendChild(listItem);
            });
        });

        selectedPlayerIndex = 0;

        let players = [
            'player',
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
            'Blast',
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

        const config = {
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

        let game = new Phaser.Game(config);
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
    },
});
