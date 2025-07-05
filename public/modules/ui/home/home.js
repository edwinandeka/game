/*
 * @module  Home - [Descripción de la vista]
 *
 * @author [correo] ([Nombre Completo])
 *
 * @license Derechos Reservados de Autor (C) DOWESOFT (dowesoft.com)
 */

Titan.modules.create({
    name: 'Home',
    /*
     * @constructor @description inicia los componentes del módulo
     */
    ready: function () {
        if (window.isMobile) {
            this.createBtn.remove();
        } else {
            this.joinBtn.remove();
            this.playerNameInput.remove();
            this.roomCodeInput.remove();
        }
    },

    /**
     * @name createRoom
     * @description [descripción de la funcion]
     * @return {void}
     */
    createRoom: function () {
        socket.emit('createRoom', {});
        socket.on('roomCreated', (roomCode) => {
            this.roomCodeInput.val(roomCode);
            localStorage.setItem('roomCode', roomCode);

            Titan.view('ui', 'waiting_room');
        });
    },

    /**
     * @name joinRoom
     * @description [descripción de la funcion]
     * @return {void}
     */
    joinRoom: function () {
        let playerName = this.playerNameInput.val();
        let roomCode = this.roomCodeInput.val().toUpperCase();
        localStorage.setItem('roomCode', roomCode);

        if (playerName != '' && roomCode != '') {
            socket.emit('joinRoom', roomCode, playerName);

            socket.once('roomNotFound', () => {
                toast('Ingresa un código de la sala válido');
            });

            socket.once('roomJoined', (player) => {
                Titan.view('ui', 'select_player');
            });
        } else {
            if (playerName == '') {
                toast('Ingresa tu nombre');
            }
            if (roomCode != '') {
                toast('Ingresa el código de la sala');
            }
        }
    },
});
