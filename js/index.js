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
        position: {x: 100, y: 400},
        velocity: {x: 0, y: 1},
        collisionBlocks
    }
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

        player.update()

        // Hogy a játékos alapvetően ne mozogjon X tengelyen, csak ha nyomva van valamelyik gomb.
        player.velocity.x = 0
        if (keys.a.pressed) {
            player.velocity.x = -5
        } else if (keys.d.pressed) {
            player.velocity.x = 5
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
