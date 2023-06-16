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
        preload: preload,
        create: create,
        update: update,
    },
};

let player;
let player2;
let weapon;
let weapons = [];
var maxBullets = 2; // Número máximo de balas que pueden estar en juego a la vez
var bullets;
let layer1;
let layer2;
let guns;

let cursors;
let playerNameText;

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

setTimeout(() => {
    let game = new Phaser.Game(config);
}, 100);

function preload() {
    // Carga la hoja de sprites del jugador
    this.load.spritesheet('player', 'assets/player.png', {
        frameWidth: 16,
        frameHeight: 24,
    });

    this.load.spritesheet('player2', 'assets/player2.png', {
        frameWidth: 16,
        frameHeight: 24,
    });

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
}

function create() {
    // Dibuja el cuerpo de colisión para depuración
    // this.physics.world.createDebugGraphic();

    // Crea una animación para el jugador
    // frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],

    // Establece el color de fondo a blanco
    this.cameras.main.setBackgroundColor('#ffffff');
    // Configura el zoom de la cámara.
    this.cameras.main.setZoom(2.5); // Ajusta este valor para que se ajuste a tus necesidades

    this.anims.create({
        key: 'idle',
        frames: this.anims.generateFrameNumbers('player', {
            frames: [4, 5, 6, 7],
        }),
        frameRate: 10,
        repeat: -1,
    });

    this.anims.create({
        key: 'jump',
        frames: this.anims.generateFrameNumbers('player', {
            frames: [8, 9, 10, 11],
        }),
        frameRate: 5,
        repeat: -1,
    });

    this.anims.create({
        key: 'run',
        frames: this.anims.generateFrameNumbers('player', {
            frames: [8, 9, 10, 11],
        }),
        frameRate: 30,
        repeat: -1,
    });

    this.anims.create({
        key: 'idle2',
        frames: this.anims.generateFrameNumbers('player2', {
            frames: [4, 5, 6, 7],
        }),
        frameRate: 10,
        repeat: -1,
    });

    this.anims.create({
        key: 'jump2',
        frames: this.anims.generateFrameNumbers('player2', {
            frames: [8, 9, 10, 11],
        }),
        frameRate: 30,
        repeat: -1,
    });

    // Habilita los controles del teclado
    cursors = this.input.keyboard.createCursorKeys();

    /************************* */
    // Create the tilemap
    const map = this.make.tilemap({ key: 'map' });

    // Load the tileset image
    const tileset = map.addTilesetImage('tileMap', 'tiles');

    // Create the layers based on layer names from Tiled
    layer1 = map.createLayer('environment', tileset);
    layer3 = map.createLayer('fondo', tileset);
    layer2 = map.createDynamicLayer('platforms', tileset);

    // Configura todos los tiles para ser colisionables basándote en sus propiedades personalizadas en Tiled.
    layer2.setCollisionByProperty({ collides: true });
    // Configura todos los tiles para ser colisionables.
    layer2.setCollisionBetween(1, 112, { collides: true });
    layer1.setAlpha(0.7);

    // Crea al jugador
    player = this.physics.add.sprite(250, 140, 'player');
    player.setSize(8, 15);
    player.setScale(1.5);
    player.setOffset(3, 9);
    player.body.gravity.y = 500;
    player.prevX = player.x;
    player.prevY = player.y;
    player.body.maxVelocity.x = 100; // Máxima velocidad horizontal
    player.body.drag.x = 1000; // Aceleración o "resistencia" horizontal

    gunContainer = map.createFromObjects('contenedores', {
        name: 'gun',
        key: 'container',
        classType: Coin,
    });

    gunContainer.forEach((gunContainer) => {
        this.physics.add.existing(gunContainer);
        // Habilita la colisión entre el personaje y la capa de tiles.
        this.physics.add.collider(
            player,
            gunContainer,
            handlePlayerGunCollision,
            null,
            this
        );
    });

    // Ajusta la cámara al tamaño del mapa
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    // Hace que la cámara siga al personaje
    this.cameras.main.startFollow(player);
    this.physics.add.collider(layer2, player);

    /************************* */

    // Crea el texto del nombre del jugador
    playerNameText = this.add.bitmapText(0, 0, 'atari', 'Eka', 6);

    // Añade un detector de teclas para la barra espaciadora
    this.spaceKey = this.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.SPACE
    );


    var enemies = this.physics.add.group();
    let enemy = enemies.create(300, 150, 'player2');
    enemy.body.maxVelocity.x = 100; // Máxima velocidad horizontal
    enemy.body.drag.x = 1000; // Aceleración o "resistencia" horizontal
    enemy.setCollideWorldBounds(true);
    enemy.setSize(8, 15);
    enemy.setScale(1.5);
    enemy.setOffset(3, 9);
    enemy.body.gravity.y = 500;
    enemy.prevX = enemy.x;
    enemy.prevY = enemy.y;
    this.physics.add.collider(enemy, layer2);
    this.physics.add.collider(enemy, player);

    // this.physics.add.overlap(player, weapon, pickUpWeapon, null, this);

    bullets = this.physics.add.group();

    // Configura la colisión entre las balas y los enemigos
    this.physics.add.collider(bullets, enemies, hitEnemy, null, this);
    this.physics.add.collider(bullets, layer2, (bullet, platform) => {
        let bulletX =
            player.weapon && player.weapon.flipX ? bullet.x - 7 : bullet.x + 7;

        let explosion = this.add.image(bulletX, bullet.y, 'bullet-pop');
        explosion.setScale(0.2);
        explosion.setSize(8, 8);

        setTimeout(() => {
            explosion.destroy();
        }, 50);

        bullet.destroy();
    });

    this.input.keyboard.on('keydown-F', function (event) {
        leftGun();
    });

    this.input.keyboard.on('keydown-G', (event) => {
        let gunNear = weapons.find((aGun) => {
            let distance = Phaser.Math.Distance.Between(
                player.x,
                player.y,
                aGun.x,
                aGun.y
            );

            return distance < 20;
        });

        if (gunNear) {
            leftGun();

            // Cambia este valor para ajustar la distancia de recogida
            player.weapon = gunNear; // Asume que el jugador tiene una propiedad 'weapon'
            player.weapon.body.setGravityY(0);

            // Desactivar físicas de arcade para el arma
            player.weapon.disableBody(true);
            // Remover colisión entre el arma y la capa del suelo
            // Asume que 'groundLayer' es la capa del suelo y que has añadido colisión entre el arma y la capa del suelo
            this.physics.world.removeCollider(player.weapon.body.collider);
        }
    });
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

    let bulletX = player.weapon.flipX ? bullet.x - 7 : bullet.x + 7;

    let explosion = this.add.image(bulletX, bullet.y, 'bullet-pop');
    explosion.setScale(0.2);
    explosion.setSize(8, 8);

    setTimeout(() => {
        explosion.destroy();
    }, 50);

    bullet.destroy();
}

function fireBullet() {
    let bulletX = player.weapon.flipX
        ? player.weapon.x - 14
        : player.weapon.x + 12;

    if (bullets.countActive(true) < maxBullets) {
        let bullet = bullets.create(bulletX, player.weapon.y - 3, 'bullet');
        bullet.setScale(0.3);
        bullet.setSize(32, 10);
        bullet.body.gravity.y = 0; // Deshabilita la gravedad para esta bala

        if (player.weapon.flipX) {
            // Dispara a la izquierda
            bullet.setVelocityX(-400);
        } else {
            // Dispara a la derecha
            bullet.setVelocityX(400);
        }
    }
}

function update() {
    // this.physics.world.wrap(player, 5);

    // Controla el movimiento del jugador
    if (cursors.left.isDown) {
        player.setOffset(5, 9);

        player.setVelocityX(-160);
        player.setFlipX(true); // Mira hacia la izquierda

        if (player.body.onFloor()) {
            // solo reproduce la animación 'run' si el jugador está en el suelo
            player.anims.play('run', true);
        }
    } else if (cursors.right.isDown) {
        player.setOffset(3, 9);

        player.setVelocityX(160);
        player.setFlipX(false); // Mira hacia la derecha

        if (player.body.onFloor()) {
            // solo reproduce la animación 'run' si el jugador está en el suelo
            player.anims.play('run', true);
        }
    } else {
        player.setVelocityX(0);
        if (player.body.onFloor()) {
            // solo reproduce la animación 'idle' si el jugador está en el suelo
            player.anims.play('idle', true);
        }
    }

    if (cursors.up.isDown && player.body.onFloor()) {
        player.setVelocityY(-250); // Ajusta este valor según lo alto que quieras que el jugador salte
        player.anims.play('jump', true); // reproduce la animación 'jump' cuando el jugador está saltando
    }

    // Actualiza la posición del texto del nombre del jugador para que esté encima del personaje
    playerNameText.x = player.x - 10;
    playerNameText.y = player.y - 16; // Ajusta este valor según sea necesario

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

    if (Phaser.Input.Keyboard.JustDown(cursors.space) && player.weapon) {
        fireBullet();
    }

    // Itera sobre todas las balas en el grupo
    bullets.children.each((bullet) => {
        // Si la bala ha salido de la pantalla...
        if (
            bullet.x < 0 ||
            bullet.x > this.game.config.width ||
            bullet.y < 0 ||
            bullet.y > this.game.config.height
        ) {
            // ...desactiva y oculta la bala
            bullet.destroy();
        }
    });
}
