import {ctx, canvas} from "./index.js"

export class Sprite {
    constructor({position, imageSrc}) {
        this.position = position
        this.image = new Image()
        this.image.src = imageSrc
    }

    update() {
        this.draw()
    }

    draw() {
        if (!this.image) {
            return
        }
        ctx.drawImage(this.image, this.position.x, this.position.y,)
    }
}

class Player {
    constructor(canvas, ctx, position, velocity) {
        this.position = position
        this.velocity = velocity
        this.gravity = 0.2
        this.height = 100
        this.width = 100
    }

    draw() {
        ctx.fillStyle = 'red'
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    update() {
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y


        if (this.position.y + this.height <= canvas.height) {
            this.velocity.y += this.gravity
        } else {
            this.velocity.y = 0
        }
        this.draw()
    }
}


export {
    Player,
}
