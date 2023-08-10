import {ctx, canvas, SCALE_NUMBER} from "./index.js"
import {collision} from "./collision.js"

class CollisionBlock {
    constructor({position}) {
        this.position = position
        this.width = 16
        this.height = 16
    }

    update() {
        this.draw()
    }

    draw() {
        ctx.fillStyle = 'rgba(255,0,0,0.5)'
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}

class Sprite {
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
    constructor({position, velocity, collisionBlocks}) {
        this.position = position
        this.velocity = velocity
        this.gravity = 0.2
        this.height = 100 / SCALE_NUMBER
        this.width = 100 / SCALE_NUMBER
        this.collisionBlocks = collisionBlocks
    }

    draw() {
        ctx.fillStyle = 'red'
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.checkForHorizontalCollision()
        this.applyGravity()
        this.checkForVerticalCollision()
    }

    checkForHorizontalCollision() {
        for (let i = 0; i < this.collisionBlocks.length; i++) {
            const collisionBlock = this.collisionBlocks[i]

            if (collision({object1: this, object2: collisionBlock})) {
                if (this.velocity.x > 0) {
                    this.velocity.x = 0
                    this.position.x = collisionBlock.position.x - this.width - 0.01
                    break
                }

                if (this.velocity.x < 0) {
                    this.velocity.x = 0
                    this.position.x = collisionBlock.position.x + collisionBlock.width + 0.01
                    break
                }
            }
        }
    }

    applyGravity() {
        this.position.y += this.velocity.y
        this.velocity.y += this.gravity
    }

    checkForVerticalCollision() {
        for (let i = 0; i < this.collisionBlocks.length; i++) {
            const collisionBlock = this.collisionBlocks[i]

            if (collision({object1: this, object2: collisionBlock})) {
                if (this.velocity.y > 0) {
                    this.velocity.y = 0
                    this.position.y = collisionBlock.position.y - this.height - 0.01
                    break
                }

                if (this.velocity.y < 0) {
                    this.velocity.y = 0
                    this.position.y = collisionBlock.position.y + collisionBlock.height + 0.01
                    break
                }
            }
        }
    }
}


export {
    CollisionBlock,
    Sprite,
    Player,
}
