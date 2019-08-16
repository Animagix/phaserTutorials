import Phaser from "phaser";

import skyImg from "./assets/sky.png";
import groundImg from "./assets/platform.png";
import starImg from "./assets/star.png";
import bombImg from "./assets/bomb.png";
import dudeImg from "./assets/dude.png";

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 300},
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

let score = 0;

let platforms,
    player,
    cursors,
    stars,
    scoreText;

function preload() {
    this.load.image('sky', skyImg);
    this.load.image('ground', groundImg);
    this.load.image('star', starImg);
    this.load.image('bomb', bombImg);
    this.load.spritesheet('dude', dudeImg, {frameWidth: 32, frameHeight: 48});
}

function character() {
    // create player
    player = this.physics.add.sprite(100, 450, 'dude');

    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    // go to left
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', {start: 0, end: 3}),
        frameRate: 10,
        repeat: -1 // animation will start again on finish
    });

    // stand
    this.anims.create({
        key: 'turn',
        frames: [{key: 'dude', frame: 4}],
        frameRate: 20
    });

    // go to right
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', {start: 5, end: 8}),
        frameRate: 10,
        repeat: -1
    });
}

function ground() {
    platforms = this.physics.add.staticGroup();

    platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');
}

function sky() {
    this.add.image(400, 300, 'sky');
}

function createStars() {
    stars = this.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY: {x: 12, y: 0, stepX: 70}
    });

    stars.children.iterate(function (child) {

        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });
}

function collectStar(player, star) {
    star.disableBody(true, true);

    incrementScore();
}

function createScore(){
    scoreText = this.add.text(16, 16, 'Puntacos: 0', { fontSize: '32px', fill: '#dadada' });
}

function incrementScore() {
    score += 10;
    scoreText.setText('Vaaaamos!: ' + score);
}

function create() {
    sky.call(this);
    ground.call(this);
    character.call(this);
    createStars.call(this);
    createScore.call(this);

    cursors = this.input.keyboard.createCursorKeys();

    this.physics.add.collider(player, platforms);
    this.physics.add.collider(stars, platforms);

    this.physics.add.overlap(player, stars, collectStar, null, this);
}

function update() {
    if (cursors.left.isDown) {
        player.setVelocityX(-160);

        player.anims.play('left', true);
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);

        player.anims.play('right', true);
    } else {
        player.setVelocityX(0);

        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-330);
    }
}
