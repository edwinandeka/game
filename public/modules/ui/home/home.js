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
    ready: function () {},

    /**
     * @name createRoom
     * @description [descripción de la funcion]
     * @return {void}
     */
    createRoom: function () {
        let playerName = this.playerNameInput.val();
        socket.emit('createRoom', playerName);

        socket.on('roomCreated', (roomCode) => {
            this.roomCodeInput.val(roomCode);
			localStorage.setItem('roomCode', roomCode)
        });
    },

  /**
     * @name joinRoom
     * @description [descripción de la funcion]
     * @return {void}
     */
  joinRoom: function () {
	let playerName = this.playerNameInput.val();
	let roomCode = this.roomCodeInput.val();
	localStorage.setItem('roomCode', roomCode)

	socket.emit('joinRoom', roomCode, playerName);

	socket.on('roomJoined', (roomCode) => {
		Titan.view("ui", "waiting_room");
	});
},
	
});
