/**
 * Phaser Plugin - Virtual Gamepad
 * @author      Edwin Ramiro Ospina Ruiz <edwinandeka@gmail.com>
 * @copyright   2023 Edwin Ramiro Ospina Ruiz
 */
window.PhaserVirtualGamepad;
(function (Phaser) {
    // Static variables
    var UP_LOWER_BOUND = -7 * (Math.PI / 8);
    var UP_UPPER_BOUND = -1 * (Math.PI / 8);
    var DOWN_LOWER_BOUND = Math.PI / 8;
    var DOWN_UPPER_BOUND = 7 * (Math.PI / 8);
    var RIGHT_LOWER_BOUND = -3 * (Math.PI / 8);
    var RIGHT_UPPER_BOUND = 3 * (Math.PI / 8);
    var LEFT_LOWER_BOUND = 5 * (Math.PI / 8);
    var LEFT_UPPER_BOUND = -5 * (Math.PI / 8);

    /**
     * The Virtual Gamepad adds a thumbstick and button(s) to mobile devices.
     *
     * @class PhaserVirtualGamepad
     * @constructor
     * @param {Object} game - The main Game object
     */
    window.PhaserVirtualGamepad = {
        // constructor
        ready: function (phaserGame) {
            this.phaserGame = phaserGame;
            // Class members
            this.input = this.phaserGame.game.input;
            this.joystick = null;
            this.joystickPad = null;
            this.joystickPoint = null;
            this.joystickRadius = null;
            this.joystickPointer = null;
            this.button = null;
            this.buttonPoint = null;
            this.buttonRadius = null;
            this.lastControls = null;

            this.buttons = [];

            // Polling for the joystick and button pushes
            // this.preUpdate = gamepadPoll.bind(this);
        },

        /**
         * Add a joystick to the screen (only one joystick allowed for now)
         *
         * @method PhaserVirtualGamepad#addJoystick
         * @param {number} x - Position (x-axis) of the joystick on the canvas
         * @param {number} y - Position (y-axis) of the joystick on the canvas
         * @param {number} scale - Size of the sprite. 1.0 is 100x100 pixels
         * @param {String} key - key for the gamepad's spritesheet
         * @param {Phaser.Sprite} The joystick object just created
         */
        addJoystick: function (x, y, scale, key) {
            // If we already have a joystick, return null
            if (this.joystick !== null) {
                return null;
            }

            // // Add the joystick to the game
            this.joystick = this.phaserGame.physics.add.sprite(x, y, key);
            this.joystick.setFrame(2);
            this.joystick.setOrigin(0.5);
            this.joystick.setScrollFactor(0);
            this.joystick.setScale(scale);

            this.joystickPad = this.phaserGame.physics.add.sprite(x, y, key);
            this.joystickPad.setFrame(3);
            this.joystickPad.setOrigin(0.5);
            this.joystickPad.setScrollFactor(0);
            this.joystickPad.setScale(scale);

            // Remember the coordinates of the joystick
            this.joystickPoint = new Phaser.Math.Vector2(x, y);

            // Set up initial joystick properties
            this.joystick.properties = {
                inUse: false,
                up: false,
                down: false,
                left: false,
                right: false,
                x: 0,
                y: 0,
                distance: 0,
                angle: 0,
                rotation: 0,
            };

            // Set the touch area as defined by the button's radius
            this.joystickRadius = scale * (this.joystick.width / 2);

            return this.joystick;
        },

        /**
         * Add a button to the screen (only one button allowed for now)
         *
         * @method PhaserVirtualGamepad#addButton
         * @param {number} x - Position (x-axis) of the button on the canvas
         * @param {number} y - Position (y-axis) of the button on the canvas
         * @param {number} scale - Size of the sprite. 1.0 is 100x100 pixels
         * @param {String} key - key for the gamepad's spritesheet
         * @param {Phaser.Button} The button object just created
         */
        addButton: function (x, y, scale, key, keyboard) {
            let button = this.phaserGame.add.sprite(x, y, key).setInteractive();
            button.setFrame(1);

            button.keyboard = keyboard;
            // Set the touch area as defined by the button's radius
            this.buttonRadius = scale * (button.width / 2);
            this.buttons.push(button);

            //             button.on('pointerdown', () => {
            //                 // código a ejecutar cuando el botón es presionado
            //                 console.log('pointerdown', 'button ' + keyboard);
            //
            //                 this.joystick.properties[keyboard] = true;
            //             });
            //
            //             button.on('pointerup', () => {
            //                 // código a ejecutar cuando el botón es presionado
            //                 console.log('pointerup', 'button ' + keyboard);
            //                 if (!this.joystick.properties[keyboard]) {
            //                     this.joystick.properties[keyboard] = {};
            //                 }
            //                 this.joystick.properties[keyboard] = false;
            //             });
        },

        gamepadUpdate: function () {
            var resetJoystick = true;

            // See if any pointers are in range of the joystick or buttons
            // this.button.isDown = false;
            // this.button.frame = 0;
            // this.phaserGame.game.input.pointers.forEach((p) => {
            //     resetJoystick = this.testDistance(p);
            // });

            for (let i = 1; i <= 10; i++) {
                let pointer = this.input['pointer' + i];
                if (pointer) {
                    testDistance(pointer, this);
                }
            }

            // See if the mouse psfaointer is in range of the joystick or buttons
            resetJoystick = this.testDistance(this.input.activePointer);

            // If the pointer is removed, reset the joystick
            if (resetJoystick) {
                if (
                    this.joystickPointer === null ||
                    !this.joystickPointer.isDown
                ) {
                    this.moveJoystick(this.joystickPoint);
                    this.joystick.properties.inUse = false;
                    this.joystickPointer = null;
                }
            }
        },

        testDistance: function (pointer) {
            var reset = true;

            // See if the pointer is over the joystick

            var d = Phaser.Math.Distance.Between(
                this.joystickPoint.x,
                this.joystickPoint.y,
                pointer.x,
                pointer.y
            );
            // console.log(d, 'pointer.isDown >> ' + pointer.isDown);

            // var d = this.joystickPoint.distance(pointer.position);
            if (pointer.isDown && d < this.joystickRadius) {
                reset = false;
                this.joystick.properties.inUse = true;
                this.joystickPointer = pointer;
                this.moveJoystick(pointer.position, pointer);
            }

            // See if the pointer is over the button
            // d = this.buttonPoint.distance(pointer.position);
            // if (pointer.isDown && d < this.buttonRadius) {
            //     this.button.isDown = true;
            //     this.button.frame = 1;
            // }

            // Set bounds on buttons pad
            for (let i = 0; i < this.buttons.length; i++) {
                const button = this.buttons[i];

                let distancebutton = Phaser.Math.Distance.Between(
                    button.x,
                    button.y,
                    pointer.position.x,
                    pointer.position.y
                );

                //
                if (pointer.isDown && distancebutton < this.buttonRadius) {
                    this.joystick.properties[button.keyboard] = true;
                    button.setFrame(1);
                } else {
                    this.joystick.properties[button.keyboard] = false;
                    button.setFrame(0);
                }
            }

            return reset;
        },

        moveJoystick: function (point, pointer) {
            // Calculate x/y of pointer from joystick center
            var deltaX = point.x - this.joystickPoint.x;
            var deltaY = point.y - this.joystickPoint.y;

            // Get the angle (radians) of the pointer on the joystick
            // var rotation = this.joystickPoint.angle(point);
            let rotation = Phaser.Math.Angle.Between(
                this.joystickPoint.x,
                this.joystickPoint.y,
                point.x,
                point.y
            );

            let distanceJoystick = Phaser.Math.Distance.Between(
                this.joystickPoint.x,
                this.joystickPoint.y,
                point.x,
                point.y
            );

            if (distanceJoystick > this.joystickRadius) {
                deltaX =
                    deltaX === 0 ? 0 : Math.cos(rotation) * this.joystickRadius;
                deltaY =
                    deltaY === 0 ? 0 : Math.sin(rotation) * this.joystickRadius;
            }

            // Normalize x/y
            this.joystick.properties.x = parseInt(
                (deltaX / this.joystickRadius) * 100,
                10
            );
            this.joystick.properties.y = parseInt(
                (deltaY / this.joystickRadius) * 100,
                10
            );

            // Set polar coordinates
            this.joystick.properties.rotation = rotation;
            this.joystick.properties.angle = (180 / Math.PI) * rotation;
            this.joystick.properties.distance = parseInt(
                (distanceJoystick / this.joystickRadius) * 100,
                10
            );

            // Set d-pad directions
            this.joystick.properties.up =
                rotation > UP_LOWER_BOUND && rotation <= UP_UPPER_BOUND;
            this.joystick.properties.down =
                rotation > DOWN_LOWER_BOUND && rotation <= DOWN_UPPER_BOUND;
            this.joystick.properties.right =
                rotation > RIGHT_LOWER_BOUND && rotation <= RIGHT_UPPER_BOUND;
            this.joystick.properties.left =
                rotation > LEFT_LOWER_BOUND || rotation <= LEFT_UPPER_BOUND;

            // Fix situation where left/right is true if X/Y is centered
            if (
                this.joystick.properties.x === 0 &&
                this.joystick.properties.y === 0
            ) {
                this.joystick.properties.right = false;
                this.joystick.properties.left = false;
            }

            // Move joystick pad images
            this.joystickPad.x = this.joystickPoint.x + deltaX;
            this.joystickPad.y = this.joystickPoint.y + deltaY;

            let controls = this.joystick.properties;
            if (
                !this.lastControls ||
                this.lastControls != JSON.stringify(controls)
            ) {
                let roomCode = localStorage.getItem('roomCode');
                socket.emit('controls', controls, roomCode);

                this.lastControls = JSON.stringify(controls);
            }
        },
    };
})(Phaser);
