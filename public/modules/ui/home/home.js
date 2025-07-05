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
        const params = new URLSearchParams(window.location.search);
        const roomIdFromURL = params.get('roomId');

        if (roomIdFromURL) {
            this.roomCodeInput.val(roomIdFromURL.toUpperCase());
        }

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
        socket.on('roomCreated', ({
            roomId,
            qrCode,
            wsURL,
            url,
        }) => {

            this.roomCodeInput.val(roomId);
            localStorage.setItem('roomCode', roomId);
            localStorage.setItem('qrCode', qrCode);
            localStorage.setItem('wsURL', url);

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
