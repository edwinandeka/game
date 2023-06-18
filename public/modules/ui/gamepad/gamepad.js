/*
 * @module  Gamepad - [Descripción de la vista]
 *
 * @author [correo] ([Nombre Completo])
 *
 * @license Derechos Reservados de Autor (C) DOWESOFT (dowesoft.com)
 */

Titan.modules.create({
    name: 'Gamepad',
    /*
     * @constructor @description inicia los componentes del módulo
     */
    ready: function () {
        // this.get('.button').on('mousedown', this.onPressButton.bind(this));
        // this.get('.button').on('mouseup', this.onPressUpButton.bind(this));

        var joystick;

        function preloadGamepad() {
            // Load the gamepad spritesheet. Note that the width must equal height
            // of the sprite.
            this.load.spritesheet('gamepad', 'assets/gamepad_spritesheet.png', {
                frameWidth: 100,
                frameHeight: 100,
            });

            // Carga la imagen de la fuente y el archivo de descripción de la fuente.
            this.load.bitmapFont(
                'atari',
                'assets/fonts/atari-smooth-black.png',
                'assets/fonts/atari-smooth.xml'
            );
        }

        function createGamepad() {
            // game.renderer.roundPixels = true;

            // Establece el color de fondo a blanco
            this.cameras.main.setBackgroundColor('#888');

            var style = {
                font: '14px Arial',
                fill: '#ffffff',
                align: 'left',
                stroke: '#000000',
            };

            this.directionText = this.add.bitmapText(
                20,
                20,
                'atari',
                'eka',
                18
            );
            this.rectangularText = this.add.bitmapText(
                20,
                140,
                'atari',
                'eka',
                18
            );
            this.polarText = this.add.bitmapText(20, 260, 'atari', 'eka', 18);
            this.pushText = this.add.bitmapText(20, 380, 'atari', 'eka', 18);

            this.game;
            let visibleWidth = this.sys.game.scale.width;
            let visibleHeight = this.sys.game.scale.height;

            this.gamepad = PhaserVirtualGamepad;
            this.gamepad.ready(this);

            this.joystick = this.gamepad.addJoystick(
                100,
                visibleHeight - 180,
                1.2,
                'gamepad'
            );
            this.button = this.gamepad.addButton(
                visibleWidth - 80,
                visibleHeight - 140,
                1.0,
                'gamepad',
                'a'
            );

            this.button = this.gamepad.addButton(
                visibleWidth - 180,
                visibleHeight - 80,
                1.0,
                'gamepad',
                'b'
            );
        }

        function updateGamepad() {
            this.gamepad.gamepadUpdate();

            this.directionText.text =
                'Direction:\n up: ' +
                this.joystick.properties.up +
                '\n down: ' +
                this.joystick.properties.down +
                '\n left: ' +
                this.joystick.properties.left +
                '\n right: ' +
                this.joystick.properties.right;

            let text = '';

            for (let i = 1; i <= 10; i++) {
                let pointer = this.input['pointer' + i];
                if (pointer) {
                    text += 'pointer' + i + ' \n';
                }
            }
            this.rectangularText.text = text;

            // this.rectangularText.text =
            //     'Rectangular:\n x: ' +
            //     this.joystick.properties.x +
            //     '\n y: ' +
            //     this.joystick.properties.y;
            // this.polarText.text =
            //     'Polar:\n distance: ' +
            //     this.joystick.properties.distance +
            //     '\n angle: ' +
            //     Math.round(this.joystick.properties.angle * 100) / 100 +
            //     '\n rotation: ' +
            //     Math.round(this.joystick.properties.rotation * 100) / 100;
            // this.pushText.text =
            //     'Joystick: ' +
            //     this.joystick.properties.inUse +
            //     '\nButton: ' +
            //     this.button.isDown;
        }

        var fireLaser = function () {
            console.log('fireLaser...');
        };

        const configGamepad = {
            type: Phaser.AUTO,
            antialias: true,
            parent: 'animation-container',
            physics: {
                default: 'arcade',
            },
            scale: {
                parent: 'pito',
                mode: Phaser.Scale.RESIZE,
                autoCenter: Phaser.Scale.CENTER_BOTH,
                // zoom: 2, // Ajusta este valor para que se ajuste a tus necesidades
            },
            scene: {
                preload: preloadGamepad,
                create: createGamepad,
                update: updateGamepad,
            },
            input: {
                activePointers: 10 // Aquí puedes cambiar el número para permitir más o menos toques simultáneos
            },
        };

        var game = new Phaser.Game(configGamepad);
    },

    /**
     * @name onPressButton
     * @description [descripción de la funcion]
     * @return {void}
     */
    onPressButton: function (elem, event) {
        event.preventDefault();

        elem = $(elem.target || elem[0]);

        let roomCode = localStorage.getItem('roomCode');

        let button = elem.data('button');

        socket.emit('controls', button, true, roomCode);

        if ('vibrate' in navigator) {
            // Vibrar durante 1000 ms (1 segundo)
            navigator.vibrate(10);
        } else {
            // El navegador no es compatible con la vibración
            alert('La vibración no es compatible en este navegador.');
        }

        console.log('button on ', button);

        this.button.text(`${button} ON`);
    },

    /**
     * @name onPressButton
     * @description [descripción de la funcion]
     * @return {void}
     */
    onPressUpButton: function (elem, event) {
        event.preventDefault();

        elem = $(elem.target || elem[0]);
        let roomCode = localStorage.getItem('roomCode');
        let button = elem.data('button');

        socket.emit('controls', button, false, roomCode);

        console.log('button off ', button);
        this.button.text(`${button} OFF`);

        if ('vibrate' in navigator) {
            // Vibrar durante 1000 ms (1 segundo)
            navigator.vibrate(10);
        } else {
            // El navegador no es compatible con la vibración
            alert('La vibración no es compatible en este navegador.');
        }
    },
});
