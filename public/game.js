socket = io();

// Maneja el evento 'disconnect' para recargar la página
socket.on('disconnect', () => {
    location.reload(); // Recargar la página
});

const WEAPON_TYPES = {
    pistol: {
        key: 'pistol',
        fireRate: 500,
        bulletSpeed: 400,
        bulletSprite: 'bullet-pistol',
        weaponSprite: 'weapon-pistol',
        maxAmmo: 10
    },
    shotgun: {
        key: 'shotgun',
        fireRate: 900,
        bulletSpeed: 300,
        bulletSprite: 'bullet-shotgun',
        weaponSprite: 'weapon-shotgun',
        maxAmmo: 8
    },
    sniper: {
        key: 'sniper',
        fireRate: 1500,
        bulletSpeed: 600,
        bulletSprite: 'bullet-sniper',
        weaponSprite: 'weapon-sniper',
        maxAmmo: 3
    }
};

class WeaponBase extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.lastFired = 0;
        this.cooldown = 500; // milisegundos por defecto
        this.setScale(0.6);
        this.setSize(24, 16);
        this.body.gravity.y = 500;
    }

    canFire(time) {
        return time > this.lastFired + this.cooldown;
    }

    updateLastFired(time) {
        this.lastFired = time;
    }

    fire(player, time) {
        // Se implementa en subclases
    }
}
class Pistol extends WeaponBase {
    constructor(scene, x, y) {
        super(scene, x, y, WEAPON_TYPES.pistol.weaponSprite);
        this.cooldown = WEAPON_TYPES.pistol.fireRate;
        this.type = 'pistol';
        this.data = {
            type: this.type,
            ammo: WEAPON_TYPES.pistol.maxAmmo,
            maxAmmo: WEAPON_TYPES.pistol.maxAmmo,
        };
    }

    fire(player, time) {
        if (!this.canFire(time)) return;
        if (this.data.ammo <= 0) return;
        this.updateLastFired(time);
        this.data.ammo--;
        fireBullet(player, WEAPON_TYPES.pistol.bulletSpeed, 'bullet');
    }
}

class Shotgun extends WeaponBase {
    constructor(scene, x, y) {
        super(scene, x, y, WEAPON_TYPES.shotgun.weaponSprite);
        this.cooldown = WEAPON_TYPES.shotgun.fireRate;
        this.type = 'shotgun';
        this.data = {
            type: this.type,
            ammo: WEAPON_TYPES.shotgun.maxAmmo,
            maxAmmo: WEAPON_TYPES.shotgun.maxAmmo,
        };
    }

    fire(player, time) {
        if (!this.canFire(time)) return;
        if (this.data.ammo <= 0) return;
        this.updateLastFired(time);
        this.data.ammo--;
        fireBullet(player, WEAPON_TYPES.shotgun.bulletSpeed, 'bullet', -5);
        fireBullet(player, WEAPON_TYPES.shotgun.bulletSpeed, 'bullet', 0);
        fireBullet(player, WEAPON_TYPES.shotgun.bulletSpeed, 'bullet', 5);
    }
}

class RocketLauncher extends WeaponBase {
    constructor(scene, x, y) {
        super(scene, x, y, WEAPON_TYPES.sniper.weaponSprite);
        this.cooldown = WEAPON_TYPES.sniper.fireRate;
        this.type = 'sniper';
        this.data = {
            type: this.type,
            ammo: WEAPON_TYPES.sniper.maxAmmo,
            maxAmmo: WEAPON_TYPES.sniper.maxAmmo,
        };
    }

    fire(player, time) {
        if (!this.canFire(time)) return;
        if (this.data.ammo <= 0) return;
        this.updateLastFired(time);
        this.data.ammo--;
        fireBullet(player, WEAPON_TYPES.sniper.bulletSpeed, 'rocket-bullet');
    }
}




window.players;

window.isMobile = false;
if (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
    )
) {
    window.isMobile = true;
}

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
        parent: 'render-game',
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

let levels = ['level1', 'level2'];

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

    this.load.spritesheet('ghost', `assets/ghost.png`, {
        frameWidth: 16,
        frameHeight: 24,
    });

    // Carga el archivo del tileset
    // this.load.tilemapTiledJSON('map', 'assets/level1.json');
    let level = Math.round(Math.random()) + 1;
    this.load.tilemapTiledJSON('map', `assets/level${level}.json`);

    this.load.image('tiles', 'assets/tileMap.png');

    // Carga la imagen de la fuente y el archivo de descripción de la fuente.
    this.load.bitmapFont(
        'atari',
        'assets/fonts/atari-smooth-black.png',
        'assets/fonts/atari-smooth.xml'
    );
    // Armas
    this.load.image('weapon-pistol', 'assets/weapons/pistol.png');
    this.load.image('weapon-shotgun', 'assets/weapons/shotgun.png');
    this.load.image('weapon-sniper', 'assets/weapons/sniper.png');


    // Balas
    this.load.image('bullet-pistol', 'assets/tiles/laserPurple.png');
    this.load.image('bullet-shotgun', 'assets/tiles/laserPurple.png');
    this.load.image('bullet-sniper', 'assets/tiles/laserPurple.png');

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

    // animaciones del fantasma
    this.anims.create({
        key: 'idle-ghost',
        frames: this.anims.generateFrameNumbers('ghost', {
            frames: [4, 5, 6, 7],
        }),
        frameRate: 10,
        repeat: -1,
    });

    this.anims.create({
        key: 'jump-ghost',
        frames: this.anims.generateFrameNumbers('ghost', {
            frames: [8, 9, 10, 11],
        }),
        frameRate: 35,
        repeat: -1,
    });

    this.anims.create({
        key: 'run-ghost',
        frames: this.anims.generateFrameNumbers('ghost', {
            frames: [8, 9, 10, 11],
        }),
        frameRate: 30,
        repeat: -1,
    });

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
        playersPhaser.push(player);
        // Crea el texto del nombre del jugador
        let playerNameText = this.add.bitmapText(0, 0, 'atari', p.name, 6);
        player.text = playerNameText;
        player.socketPlayer = p;

        // HUD de estadísticas del jugador
        let hudText = this.add.bitmapText(0, 0, 'atari', '', 6);
        hudText.setTint(0xffff00); // color amarillo, opcional
        player.hudText = hudText;

        player.lastFired = 0;
        player.fireRate = 300; // milisegundos entre disparos
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
            playersPhaser.filter((p) => !p.isGhost),
            gunContainer,
            handlePlayerGunCollision,
            null,
            this
        );
    });

    this.physics.add.collider(layer2, playersPhaser);


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

        delete bullet.player;
        bullet.destroy();
    });


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
    if (!player.isGhost) {
        // Selecciona un arma aleatoria
        const weaponKeys = Object.keys(WEAPON_TYPES);
        const randomKey = weaponKeys[Math.floor(Math.random() * weaponKeys.length)];
        const selectedWeapon = WEAPON_TYPES[randomKey];

        let weaponInstance;
        switch (randomKey) {
            case 'pistol':
                weaponInstance = new Pistol(this, player.x, player.y);
                break;
            case 'shotgun':
                weaponInstance = new Shotgun(this, player.x, player.y);
                break;
            case 'sniper':
                weaponInstance = new RocketLauncher(this, player.x, player.y);
                break;
        }

        // Asigna el arma al jugador
        player.weapon = weaponInstance;


        weaponInstance.setSize(24, 16);
        weaponInstance.setScale(0.4);
        weaponInstance.body.gravity.y = 500;

        // Almacena datos del arma en el jugador
        player.weapon = weaponInstance;
        player.weaponData = selectedWeapon;
        player.lastFired = 0;
        player.ammo = selectedWeapon.ammo;

        this.physics.add.collider(weaponInstance, layer2);
        weaponInstance.body.enable = false;
        this.physics.world.removeCollider(weaponInstance.body.collider);

        gunContainer.destroy();
        weapons.push(weaponInstance);
    }
}

// Esta función se llama cuando una bala golpea a un enemigo
function hitEnemy(enemy, bullet) {
    // Aquí puedes poner el código para manejar lo que sucede cuando una bala golpea a un enemigo.
    // Por ejemplo, podrías destruir tanto la bala como el enemigo:
    // Rotar al enemigo 90 grados. Esto asume que la orientación original del enemigo es hacia arriba.
    // Si tu sprite está orientado de manera diferente, es posible que necesites ajustar el ángulo.
    enemy.angle = 90;
    enemy.setSize(15, 8);
    enemy.y -= 10; // Máxima velocidad horizontal

    let player = playersPhaser.find(
        (x) => x.socketPlayer.id == enemy.socketPlayer.id
    );
    player.isDead = true;
    // Desactivar la física del sprite.
    player.body.enable = false;

    // creamos el fantasma
    let ghost = this.physics.add.sprite(player.x, player.y - 40, 'ghost');
    ghost.alpha = 0.5;
    ghost.setSize(8, 15);
    ghost.setScale(1.5);
    ghost.setOffset(3, 9);
    // ghost.body.gravity.y = 500;
    ghost.body.maxVelocity.x = 100; // Máxima velocidad horizontal
    ghost.body.drag.x = 1000; // Aceleración o "resistencia" horizontal
    ghost.isGhost = true;
    playersPhaser.push(ghost);
    // Crea el texto del nombre del jugador
    let playerNameText = this.add.bitmapText(
        0,
        0,
        'atari',
        enemy.socketPlayer.name + ' X( ',
        6
    );
    ghost.text = playerNameText;
    ghost.socketPlayer = enemy.socketPlayer;
    // Desactiva las colisiones.
    ghost.body.checkCollision.none = true;
    ghost.anims.play('idle-ghost');
    // Desactivar la física del sprite.
    // ghost.body.enable = false;
    // players = players.filter((x) => x.id != enemy.socketPlayer.id);

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

    delete bullet.player;
    bullet.destroy();
}

function fireBullet(player, speed, spriteKey = 'bullet', angleOffset = 0) {
    const now = Date.now();
    const weaponData = player.weaponData;
    if (!weaponData || player.ammo <= 0) return;

    if (now - (player.lastFired || 0) < weaponData.fireRate) return;

    player.lastFired = now;
    player.ammo--;

    const bulletX = player.flipX ? player.weapon.x - 14 : player.weapon.x + 14;
    const bullet = bullets.create(bulletX, player.weapon.y - 3, weaponData.bulletSprite);

    bullet.setScale(0.3);
    bullet.setSize(32, 10);
    bullet.body.gravity.y = 0;
    bullet.player = player;

    const velocity = player.flipX ? -speed : speed;
    bullet.setVelocityX(velocity);
}


function updateGame() {
    let midX = 0;
    let midY = 0;

    const alivePlayers = playersPhaser.filter(p => !p.isGhost);

    playersPhaser.forEach((player) => {
        this.physics.world.wrap(player, 5);

        if (!player.isGhost) {
            midX += player.x;
            midY += player.y;
        }

        if (player.isDead) {
            player.anims.stop();
            return;
        }

        const controlPlayer = players.find(p => p.id == player.socketPlayer.id);
        if (!controlPlayer) return;

        const cursors = controlPlayer.controls;

        debugger

        // --- Movimiento horizontal ---
        let targetVelocityX = 0;
        if (cursors.left) {
            targetVelocityX = -160;
            player.setFlipX(true);
            player.setOffset(5, 9);
        }
        if (cursors.right) {
            targetVelocityX = 160;
            player.setFlipX(false);
            player.setOffset(3, 9);
        }

        player.setVelocityX(targetVelocityX);

        // --- Movimiento vertical fantasmas ---
        if (player.isGhost) {
            if (cursors.up) {
                player.setVelocityY(-160);
            } else if (cursors.down) {
                player.setVelocityY(160);
            } else {
                player.setVelocityY(0);
            }
        }

        // --- Salto ---
        if (cursors.a && player.body.onFloor()) {
            player.setVelocityY(-250);
            player.anims.play(
                player.isGhost ? 'jump-ghost' : 'jump' + player.socketPlayer.selectedPlayerIndex,
                true
            );
        }

        // --- Animación de movimiento en piso ---
        if (player.body.onFloor() && !cursors.a) {
            if (targetVelocityX !== 0 || cursors.up || cursors.down) {
                player.anims.play(
                    player.isGhost ? 'run-ghost' : 'run' + player.socketPlayer.selectedPlayerIndex,
                    true
                );
            } else {
                player.anims.play(
                    player.isGhost ? 'idle-ghost' : 'idle' + player.socketPlayer.selectedPlayerIndex,
                    true
                );
            }
        }

        // --- Posición del texto ---
        player.text.x = player.x - 10;
        player.text.y = player.y - 25;

        // --- Posición del arma ---
        if (player.weapon) {
            player.weapon.x = player.x + (player.flipX ? -10 : 10);
            player.weapon.setFlipX(player.flipX);
            player.weapon.y = player.y + 10;
        }

        // --- Disparo ---
        if (cursors.b && player.weapon && typeof player.weapon.fire === 'function') {
            player.weapon.fire(player, this.time.now);
        }

        if (player.hudText) {
            // Posición debajo del nombre
            player.hudText.x = player.x - 10;
            player.hudText.y = player.y - 15;

            player.weapon

            debugger

            if (player.weapon?.data) {
                const { type, ammo, maxAmmo } = player.weapon.data;
                player.hudText.setText(`${type.toUpperCase()} ${ammo}/${maxAmmo}`);
            } else {
                player.hudText.setText('');
            }
        }
    });


    // --- Cámara sigue al punto medio de los jugadores vivos ---
    midX /= alivePlayers.length || 1;
    midY /= alivePlayers.length || 1;
    this.cameras.main.startFollow({ x: midX, y: midY });

    // --- Zoom dinámico según distancia ---
    let maxDistance = 0;
    for (let i = 0; i < alivePlayers.length; i++) {
        for (let j = i + 1; j < alivePlayers.length; j++) {
            const dist = Phaser.Math.Distance.Between(
                alivePlayers[i].x, alivePlayers[i].y,
                alivePlayers[j].x, alivePlayers[j].y
            );
            if (dist > maxDistance) maxDistance = dist;
        }
    }

    const minZoom = 1.6;
    const maxZoom = 3;
    const maxExpectedDistance = 800;

    const normalized = Phaser.Math.Clamp(maxDistance / maxExpectedDistance, 0, 1);
    const desiredZoom = maxZoom - (maxZoom - minZoom) * normalized;
    const smoothZoom = Phaser.Math.Linear(this.cameras.main.zoom, desiredZoom, 0.05);
    this.cameras.main.setZoom(smoothZoom);
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
    Titan.view('ui', 'home');
    // Titan.view('ui', 'select_player');
    // Titan.view("ui", "gamepad");
    // document.oncontextmenu = function() {return false;};
});
