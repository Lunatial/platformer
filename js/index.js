import {Player, Sprite, CollisionBlock,} from "./classes.js"
import {floorCollisions, platformCollisions,} from "./data/collisions.js"

export const canvas = document.querySelector('canvas')
export const ctx = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

const NUMBER_OF_HORIZONTAL_TILES = 36
// const NUMBER_OF_VERTICAL_TILES = 27
export const SCALE_NUMBER = 4
const scaledCanvas = {
    width: canvas.width / SCALE_NUMBER,
    height: canvas.height / SCALE_NUMBER,
}
const floorCollisions2D = []
for (let i = 0; i < floorCollisions.length; i += NUMBER_OF_HORIZONTAL_TILES) {
    floorCollisions2D.push(floorCollisions.slice(i, i + NUMBER_OF_HORIZONTAL_TILES))
}

const collisionBlocks = []

function fillCollisionBlocks(data) {
    data.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                collisionBlocks.push(new CollisionBlock({
                    position: {
                        x: x * 16,
                        y: y * 16
                    }
                }))
            }
        })
    })
}

fillCollisionBlocks(floorCollisions2D)

const platformCollisions2D = []
for (let i = 0; i < platformCollisions.length; i += NUMBER_OF_HORIZONTAL_TILES) {
    platformCollisions2D.push(platformCollisions.slice(i, i + NUMBER_OF_HORIZONTAL_TILES))
}

fillCollisionBlocks(platformCollisions2D)

const player = new Player(
    {
        position: {x: 100, y: 300},
        velocity: {x: 0, y: 1},
        collisionBlocks,
        imageSrc: '../img/warrior/Idle.png',
        frameRate: 8,
        animations: {
            Idle: {
                imageSrc: './img/warrior/Idle.png',
                frameRate: 8,
                frameBuffer: 7,
            },
            Run: {
                imageSrc: './img/warrior/Run.png',
                frameRate: 8,
                frameBuffer: 5,
            },
            Jump: {
                imageSrc: './img/warrior/Jump.png',
                frameRate: 2,
                frameBuffer: 3,
            },
            Fall: {
                imageSrc: './img/warrior/Fall.png',
                frameRate: 2,
                frameBuffer: 3,
            },
            FallLeft: {
                imageSrc: './img/warrior/FallLeft.png',
                frameRate: 2,
                frameBuffer: 3,
            },
            RunLeft: {
                imageSrc: './img/warrior/RunLeft.png',
                frameRate: 8,
                frameBuffer: 5,
            },
            IdleLeft: {
                imageSrc: './img/warrior/IdleLeft.png',
                frameRate: 8,
                frameBuffer: 7,
            },
            JumpLeft: {
                imageSrc: './img/warrior/JumpLeft.png',
                frameRate: 2,
                frameBuffer: 3,
            },
        },
    }
)

const background = new Sprite(
    {
        position: {x: 0, y: 0},
        imageSrc: './img/background.png',
    }
)

function animate() {
    ctx.save()

    // négyszeresére növeljük a rajzolás méretét
    ctx.scale(SCALE_NUMBER, SCALE_NUMBER)
    // a háttérkép pozícióját a bal alsó sarokba igazítjuk
    ctx.translate(0, -background.image.height + scaledCanvas.height)
    // kirajzoljuk a háttérképet
    background.update()
    // kirajzoljuk a collisionBlockokat
    collisionBlocks.forEach(block => block.update())

    player.update()

    // Hogy a játékos alapvetően ne mozogjon X tengelyen, csak ha nyomva van valamelyik gomb.
    player.velocity.x = 0
    if (keys.a.pressed) {
        player.switchSprite('RunLeft')
        player.velocity.x = -2
        player.lastDirection = 'left'
    } else if (keys.d.pressed) {
        player.switchSprite('Run')
        player.velocity.x = 2
        player.lastDirection = 'right'
    } else if (player.velocity.y === 0) {
       if (player.lastDirection === 'right') {
           player.switchSprite('Idle')
       } else {
              player.switchSprite('IdleLeft')
       }
    }

    if (player.velocity.y < 0) {
        if (player.lastDirection === 'right') {
            player.switchSprite('Jump')
        } else {
            player.switchSprite('JumpLeft')
        }
    } else if (player.velocity.y > 0) {
        if (player.lastDirection === 'right') {
            player.switchSprite('Fall')
        } else {
            player.switchSprite('FallLeft')
        }

    }


    ctx.restore()

    requestAnimationFrame(animate)
}

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    }
}

window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'a':
            keys.a.pressed = true
            break
        case 'd':
            keys.d.pressed = true
            break
        case 'w':
            player.velocity.y = -8
            break
    }
})

window.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'a':
            keys.a.pressed = false
            break
        case 'd':
            keys.d.pressed = false
            break
    }
})

animate()
