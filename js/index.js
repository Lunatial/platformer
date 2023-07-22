import {Player, Sprite} from "./classes.js"

export const canvas = document.querySelector('canvas')
export const ctx = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

const scaleNumber = 4

const scaledCanvas = {
    width: canvas.width / scaleNumber,
    height: canvas.height / scaleNumber,
}

const player1 = new Player(
    canvas,
    ctx,
    {x: 200, y: 100},
    {x: 0, y: 2},
)

const player2 = new Player(
    canvas,
    ctx,
    {x: 600, y: 140},
    {x: 0, y: 2},
)

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

const background = new Sprite(
    {
        position: {x: 0, y: 0},
        imageSrc: './img/background.png',
    }
)

function animate() {
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvas.width, canvas.height,)

    ctx.save()
        ctx.scale(scaleNumber,scaleNumber)
        ctx.translate(0, -background.image.height + scaledCanvas.height)
        background.update()
    ctx.restore()

    player1.update()
    player2.update()

    player1.velocity.x = 0
    if (keys.a.pressed) {
        player1.velocity.x = -5
    } else if (keys.d.pressed) {
        player1.velocity.x = 5
    }

    requestAnimationFrame(animate)
}

animate()

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
