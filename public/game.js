socket = io();
window.players;

socket.on('gamecontrols', (pls) => {
    players = pls;
    console.log('gamecontrols', players);
});

const config = {
    type: Phaser.AUTO,
    antialias: true,
    physics: {
        default: 'arcade',
        arcade: {
            // gravity: { y: 500 },
        },
    },
    scale: {
        parent: 'pito',
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,

        zoom: 2, // Ajusta este valor para que se ajuste a tus necesidades
    },
    scene: {
        preload: preloadGame,
        create: createGame,
        update: updateGame,
    },
};

let player2;
let weapon;
let weapons = [];
var maxBullets = 2; // Número máximo de balas que pueden estar en juego a la vez
var bullets;
let layer1;
let layer2;
let guns;

let playerNameText;

let animsLoaded = [];
let imagesLoaded = [];

let playersImages = [
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

let playersPhaser = [];

class Coin extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        // Add any custom properties or methods here
        this.value = 10;
    }

    // You can also add methods to your custom class
    collect() {
        console.log('Coin collected!');
    }
}

// setTimeout(() => {
//     // let game = new Phaser.Game(config);
// }, 100);

function preloadGame() {
    console.log('preloadGame');
    // Carga la hoja de sprites de cada jugador
    for (let i = 0; i < players.length; i++) {
        const p = players[i];
        // id:"3u1XrCw5zL9AZq7JAAAC"
        // name:"333"
        // selectedPlayerIndex:3
        if (!imagesLoaded.includes(p.selectedPlayerIndex)) {
            console.log('load image,  ', playersImages[p.selectedPlayerIndex]);
            this.load.spritesheet(
                'player' + p.selectedPlayerIndex,
                `assets/${playersImages[p.selectedPlayerIndex]}.png`,
                {
                    frameWidth: 16,
                    frameHeight: 24,
                }
            );
        }
    }

    // Carga el archivo del tileset
    // this.load.tilemapTiledJSON('map', 'assets/level1.json');
    this.load.tilemapTiledJSON('map', 'assets/level2.json');

    this.load.image('tiles', 'assets/tileMap.png');

    // Carga la imagen de la fuente y el archivo de descripción de la fuente.
    this.load.bitmapFont(
        'atari',
        'assets/fonts/atari-smooth-black.png',
        'assets/fonts/atari-smooth.xml'
    );
    this.load.image('weapon', 'assets/tiles/gun.png');
    this.load.image('bullet', 'assets/tiles/laserPurple.png');
    this.load.image('bullet-pop', 'assets/tiles/laserBlueBurst.png');
    this.load.image('container', 'assets/tiles/map/tile_0009.png');

    console.log('preloadGame finished...');
}

function createGame() {
    console.log('createGame');

    // Dibuja el cuerpo de colisión para depuración
    // this.physics.world.createDebugGraphic();

    // Crea una animación para el jugador
    // frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],

    // Establece el color de fondo a blanco
    this.cameras.main.setBackgroundColor('#ffffff');
    // Configura el zoom de la cámara.
    this.cameras.main.setZoom(2.5); // Ajusta este valor para que se ajuste a tus necesidades
    for (let j = 0; j < players.length; j++) {
        const p = players[j];

        if (!animsLoaded.includes(p.selectedPlayerIndex)) {
            this.anims.create({
                key: 'idle' + p.selectedPlayerIndex,
                frames: this.anims.generateFrameNumbers(
                    'player' + p.selectedPlayerIndex,
                    {
                        frames: [4, 5, 6, 7],
                    }
                ),
                frameRate: 10,
                repeat: -1,
            });

            this.anims.create({
                key: 'jump' + p.selectedPlayerIndex,
                frames: this.anims.generateFrameNumbers(
                    'player' + p.selectedPlayerIndex,
                    {
                        frames: [8, 9, 10, 11],
                    }
                ),
                frameRate: 35,
                repeat: -1,
            });

            this.anims.create({
                key: 'run' + p.selectedPlayerIndex,
                frames: this.anims.generateFrameNumbers(
                    'player' + p.selectedPlayerIndex,
                    {
                        frames: [8, 9, 10, 11],
                    }
                ),
                frameRate: 30,
                repeat: -1,
            });
        }
    }

    // Habilita los controles del teclado
    // cursors = this.input.keyboard.createCursorKeys();

    /************************* */
    // Create the tilemap
    const map = this.make.tilemap({ key: 'map' });

    // Load the tileset image
    const tileset = map.addTilesetImage('tileMap', 'tiles');

    // Create the layers based on layer names from Tiled
    layer1 = map.createLayer('environment', tileset);
    layer3 = map.createLayer('fondo', tileset);
    layer2 = map.createLayer('platforms', tileset);

    // Configura todos los tiles para ser colisionables basándote en sus propiedades personalizadas en Tiled.
    layer2.setCollisionByProperty({ collides: true });
    // Configura todos los tiles para ser colisionables.
    layer2.setCollisionBetween(1, 112, { collides: true });
    layer1.setAlpha(0.7);

    // Crea a los jugadores
    players.forEach((p) => {
        let player = this.physics.add.sprite(
            250,
            140,
            'player' + p.selectedPlayerIndex
        );
        player.setSize(8, 15);
        player.setScale(1.5);
        player.setOffset(3, 9);
        player.body.gravity.y = 500;
        player.body.maxVelocity.x = 100; // Máxima velocidad horizontal
        player.body.drag.x = 1000; // Aceleración o "resistencia" horizontal
        p.x = playersPhaser.push(player);
        // Crea el texto del nombre del jugador
        let playerNameText = this.add.bitmapText(0, 0, 'atari', p.name, 6);
        player.text = playerNameText;
        player.socketPlayer = p;
    });

    gunContainer = map.createFromObjects('contenedores', {
        name: 'gun',
        key: 'container',
        classType: Coin,
    });

    gunContainer.forEach((gunContainer) => {
        this.physics.add.existing(gunContainer);
        // Habilita la colisión entre el personajes y la capa de tiles.
        this.physics.add.collider(
            playersPhaser,
            gunContainer,
            handlePlayerGunCollision,
            null,
            this
        );
    });
    //
    //     // Ajusta la cámara al tamaño del mapa
    //     this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    //     // Hace que la cámara siga al personaje
    this.cameras.main.startFollow(playersPhaser);
    this.physics.add.collider(layer2, playersPhaser);
    //
    //     /************************* */
    //
    //     // Añade un detector de teclas para la barra espaciadora
    //     this.spaceKey = this.input.keyboard.addKey(
    //         Phaser.Input.Keyboard.KeyCodes.SPACE
    //     );
    //
    bullets = this.physics.add.group();

    // Configura la colisión entre las balas y los enemigos
    this.physics.add.collider(bullets, playersPhaser, hitEnemy, null, this);
    this.physics.add.collider(bullets, layer2, (bullet, platform) => {
        let bulletX =
            bullet.player && bullet.player.weapon && bullet.player.weapon.flipX
                ? bullet.x - 7
                : bullet.x + 7;

        let explosion = this.add.image(bulletX, bullet.y, 'bullet-pop');
        explosion.setScale(0.2);
        explosion.setSize(8, 8);

        setTimeout(() => {
            explosion.destroy();
        }, 50);

        // bullet.destroy();

        bullet.visible = false;
        bullet.active = false;
    });
    //
    //     this.input.keyboard.on('keydown-F', function (event) {
    //         leftGun();
    //     });
    //
    //     this.input.keyboard.on('keydown-G', (event) => {
    //         let gunNear = weapons.find((aGun) => {
    //             let distance = Phaser.Math.Distance.Between(
    //                 player.x,
    //                 player.y,
    //                 aGun.x,
    //                 aGun.y
    //             );
    //
    //             return distance < 20;
    //         });
    //
    //         if (gunNear) {
    //             leftGun();
    //
    //             // Cambia este valor para ajustar la distancia de recogida
    //             player.weapon = gunNear; // Asume que el jugador tiene una propiedad 'weapon'
    //             player.weapon.body.setGravityY(0);
    //
    //             // Desactivar físicas de arcade para el arma
    //             player.weapon.disableBody(true);
    //             // Remover colisión entre el arma y la capa del suelo
    //             // Asume que 'groundLayer' es la capa del suelo y que has añadido colisión entre el arma y la capa del suelo
    //             this.physics.world.removeCollider(player.weapon.body.collider);
    //         }
    //     });

    console.log('createGame finished...');
}

function leftGun() {
    if (player.weapon) {
        // Código para soltar el arma
        // Esto dependerá de cómo has implementado el arma en tu juego
        // Por ejemplo, podrías poner el arma en el mundo y removerla del jugador:

        player.weapon.x = parseInt(player.x);
        player.weapon.y = parseInt(player.y);
        player.weapon.body.gravity.y = 500;

        player.weapon.body.velocity.x = 100;
        player.weapon.body.velocity.y = 100;

        // Activar físicas de arcade para el arma
        player.weapon.enableBody(
            true,
            player.weapon.x,
            player.weapon.y,
            true,
            true
        );

        // Añadir gravedad al arma
        player.weapon.body.setGravityY(300);

        delete player.weapon; // Asume que el jugador tiene una propiedad 'weapon'
        // Añadir colisión entre el arma y la capa del suelo
        // Asume que 'groundLayer' es la capa del suelo
        // this.physics.add.collider(weapon, groundLayer);
    }
}

function handlePlayerGunCollision(player, gunContainer) {
    let weapon = this.physics.add.sprite(250, 240, 'weapon');
    weapon.setSize(24, 16);
    weapon.setScale(0.6);
    weapon.body.gravity.y = 500;
    this.physics.add.collider(weapon, layer2);

    // Desactivar físicas de arcade para el arma
    weapon.disableBody(true);
    // Remover colisión entre el arma y la capa del suelo
    // Asume que 'groundLayer' es la capa del suelo y que has añadido colisión entre el arma y la capa del suelo
    this.physics.world.removeCollider(weapon.body.collider);
    player.weapon = weapon;

    // Añade la arma al inventario del jugador
    // player.inventory.add(gunContainer);

    // Elimina la arma del mundo del juego
    gunContainer.destroy();
    weapons.push(weapon);
}

// Esta función se llama cuando una bala golpea a un enemigo
function hitEnemy(bullet, enemy) {
    // Aquí puedes poner el código para manejar lo que sucede cuando una bala golpea a un enemigo.
    // Por ejemplo, podrías destruir tanto la bala como el enemigo:
    // Rotar al enemigo 90 grados. Esto asume que la orientación original del enemigo es hacia arriba.
    // Si tu sprite está orientado de manera diferente, es posible que necesites ajustar el ángulo.
    enemy.angle = 90;
    enemy.setSize(15, 8);
    enemy.y -= 10; // Máxima velocidad horizontal

    let bulletX =
        bullet.player && bullet.player.weapon && bullet.player.weapon.flipX
            ? bullet.x - 7
            : bullet.x + 7;

    let explosion = this.add.image(bulletX, bullet.y, 'bullet-pop');
    explosion.setScale(0.2);
    explosion.setSize(8, 8);

    setTimeout(() => {
        explosion.destroy();
    }, 50);
    // bullet.destroy();
    bullet.visible = false;
    bullet.active = false;
    // bullet.destroy();
}

function fireBullet(player) {
    let bulletX = player.weapon.flipX
        ? player.weapon.x - 14
        : player.weapon.x + 12;

    if (bullets.countActive(true) < maxBullets) {
        let bullet = bullets.create(bulletX, player.weapon.y - 3, 'bullet');
        bullet.setScale(0.3);
        bullet.setSize(32, 10);
        bullet.body.gravity.y = 0; // Deshabilita la gravedad para esta bala
        bullet.player = player;
        if (player.weapon.flipX) {
            // Dispara a la izquierda
            bullet.setVelocityX(-400);
        } else {
            // Dispara a la derecha
            bullet.setVelocityX(400);
        }
    }
}

function updateGame() {
    var midX = 0;
    var midY = 0;

    playersPhaser.forEach((player) => {
        midX += player.x;
        midY += player.y;
        this.physics.world.wrap(player, 5);

        let controlPlayer = players.find((p) => p.id == player.socketPlayer.id);

        let cursors = controlPlayer.controls;

        // Controla el movimiento del jugador
        if (cursors.left) {
            player.setOffset(5, 9);

            player.setVelocityX(-160);
            player.setFlipX(true); // Mira hacia la izquierda

            if (player.body.onFloor()) {
                // solo reproduce la animación 'run' si el jugador está en el suelo
                player.anims.play(
                    'run' + player.socketPlayer.selectedPlayerIndex,
                    true
                );
            }
        } else if (cursors.right) {
            player.setOffset(3, 9);

            player.setVelocityX(160);
            player.setFlipX(false); // Mira hacia la derecha

            if (player.body.onFloor()) {
                // solo reproduce la animación 'run' si el jugador está en el suelo
                player.anims.play(
                    'run' + player.socketPlayer.selectedPlayerIndex,
                    true
                );
            }
        } else {
            player.setVelocityX(0);
            if (player.body.onFloor()) {
                // solo reproduce la animación 'idle' si el jugador está en el suelo
                player.anims.play(
                    'idle' + player.socketPlayer.selectedPlayerIndex,
                    true
                );
            }
        }

        if (cursors.a && player.body.onFloor()) {
            player.setVelocityY(-250); // Ajusta este valor según lo alto que quieras que el jugador salte
            player.anims.play(
                'jump' + player.socketPlayer.selectedPlayerIndex,
                true
            ); // reproduce la animación 'jump' cuando el jugador está saltando
        }

        // Actualiza la posición del texto del nombre del jugador para que esté encima del personaje
        player.text.x = player.x - 10;
        player.text.y = player.y - 25; // Ajusta este valor según sea necesario

        // Si el jugador tiene un arma, actualizar la posición del arma para que coincida con la del jugador
        if (player.weapon) {
            if (player.flipX) {
                player.weapon.x = player.x - 10;
                player.weapon.setFlipX(true);
            }
            // Si el jugador no está volteado, pon el arma a la derecha
            else {
                player.weapon.x = player.x + 10;
                player.weapon.setFlipX(false);
            }
            player.weapon.y = player.y + 10;
        }

        if (cursors.b && player.weapon) {
            fireBullet(player);
        }
    });

    // // Itera sobre todas las balas en el grupo
    // bullets.children.each((bullet) => {
    //     // Si la bala ha salido de la pantalla...
    //     if (
    //         bullet.x < 0 ||
    //         bullet.x > this.game.config.width ||
    //         bullet.y < 0 ||
    //         bullet.y > this.game.config.height
    //     ) {
    //         // ...desactiva y oculta la bala
    //         bullet.destroy();
    //     }
    // });

    midX /= playersPhaser.length;
    midY /= playersPhaser.length;

    // Haz que la cámara siga el punto medio
    this.cameras.main.startFollow({ x: midX, y: midY });
}

/*
 * @app  Bluefoler
 *
 * @author
 *
 * @license Derechos Reservados de Autor (C) dowesoft
 */
jQuery(document).ready(function ($) {
    // if (location.href.contains("localhost")) {
    //   Titan.debug();
    // }

    // Titan.view("ui", "waiting_room");
    // Titan.view("ui", "home");
    Titan.view('ui', 'home');
    // Titan.view("ui", "gamepad");
    // document.oncontextmenu = function() {return false;};
});
