import {Player, Sprite, CollisionBlock,} from "./classes.js"
import {floorCollisions, platformCollisions,} from "./data/collisions.js"

export const canvas = document.querySelector('canvas')
export const ctx = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

const NUMBER_OF_HORIZONTAL_TILES = 36
// const NUMBER_OF_VERTICAL_TILES = 27
const SCALE_NUMBER = 4
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

const player1 = new Player(
    {x: 200, y: 100},
    {x: 0, y: 2},
)

const player2 = new Player(
    {x: 600, y: 140},
    {x: 0, y: 2},
)

const background = new Sprite(
    {
        position: {x: 0, y: 0},
        imageSrc: './img/background.png',
    }
)

function animate() {
    // ctx.fillStyle = 'white'
    // ctx.fillRect(0, 0, canvas.width, canvas.height,)

    ctx.save()
        // négyszeresére növeljük a rajzolás méretét
        ctx.scale(SCALE_NUMBER, SCALE_NUMBER)
       // a háttérkép pozícióját a bal alsó sarokba igazítjuk
        ctx.translate(0, -background.image.height + scaledCanvas.height)
        // kirajzoljuk a háttérképet
        background.update()
        // kirajzoljuk a collisionBlockokat
        collisionBlocks.forEach(block => block.update())
    ctx.restore()

    player1.update()
    player2.update()

    // Hogy a játékos alapvetően ne mozogjon X tengelyen, csak ha nyomva van valamelyik gomb.
    player1.velocity.x = 0
    if (keys.a.pressed) {
        player1.velocity.x = -5
    } else if (keys.d.pressed) {
        player1.velocity.x = 5
    }

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
            if (player1.position.y + player1.height >= canvas.height) {
                player1.velocity.y = -10
            }
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
