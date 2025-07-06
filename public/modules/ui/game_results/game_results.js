
/*
* @module  Game_results - [Descripción de la vista]
* @created on 5 JUL 2025
* @author [ingrese el correo] (undefined)
*
* @license Derechos Reservados de Autor (C) DOWESOFT (dowesoft.com)
*/

Titan.modules.create({
	name: 'Game_results',
	ready: function () {
		const stats = window.finalStats || [];

		let playersNames = [
			'Blast', 'Blaze', 'Spark', 'Frost', 'Golem', 'Venom', 'Claw',
			'Vortex', 'Specter', 'Laser', 'Acid', 'Rock', 'Shoot',
		];

		this.resultsListContainer.empty();

		stats.forEach((player) => {
			this.resultsListContainer.append(`
                <li>
                    <div class="player-image" style="background-image: url(assets/player${player.selectedPlayerIndex}.png);"></div>
                    ${player.name} - <strong>${playersNames[player.selectedPlayerIndex]}</strong>
                    - Muertes: <strong>${player.deaths}</strong>
                </li>
            `);
		});

		const winners = stats.filter(p => p.deaths === 0);

		if (winners.length === 0) {
			this.resultMessage.text('🤝 ¡Empate! Todos murieron.');
		} else if (winners.length === 1) {
			this.resultMessage.text(`🏆 ¡Ganó ${winners[0].name}!`);
		} else {
			const names = winners.map(p => p.name).join(', ');
			this.resultMessage.text(`🏆 Empate entre: ${names}`);
		}

		game.destroy(true);
		let player2;
		weapon = null;
		weapons = [];
		animsLoaded = [];
		imagesLoaded = [];
		playersPhaser = [];
	},
});
