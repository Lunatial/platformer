import {ctx, canvas, SCALE_NUMBER} from "./index.js"
import {collision} from "./collision.js"

class CollisionBlock {
    constructor({position, height = 16 }) {
        this.position = position
        this.width = 16
        this.height = height
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
    constructor({position, imageSrc, frameRate = 1, frameBuffer = 3, scale = 1}) {
        this.position = position
        this.scale = scale
        this.image = new Image()
        this.image.onload = () => {
            this.width = (this.image.width / this.frameRate) * this.scale
            this.height = (this.image.height) * this.scale
        }
        this.image.src = imageSrc
        this.frameRate = frameRate
        this.currentFrame = 0
        this.frameBuffer = frameBuffer
        this.elapsedFrames = 0
    }

    update() {
        this.draw()
        this.updateFrames()
    }

    draw() {
        if (!this.image) {
            return
        }
        const cropBox = {
            position: {
                x: this.currentFrame * this.image.width / this.frameRate,
                y: 0,
            },
            width: this.image.width / this.frameRate,
            height: this.image.height,
        }

        ctx.drawImage(
            this.image,
            cropBox.position.x,
            cropBox.position.y,
            cropBox.width,
            cropBox.height,
            this.position.x,
            this.position.y,
            this.width,
            this.height,
        )
    }

    updateFrames() {
        this.elapsedFrames++
        if (this.elapsedFrames % this.frameBuffer === 0) {
            if (this.currentFrame < this.frameRate - 1) {
                this.currentFrame++
            } else {
                this.currentFrame = 0
            }
        }
    }
}

class Player extends Sprite {
    constructor({position, velocity, collisionBlocks, imageSrc, frameRate, scale = 0.5}) {
        super({position, imageSrc, frameRate, scale})
        this.position = position
        this.velocity = velocity
        this.gravity = 0.5
        this.collisionBlocks = collisionBlocks
    }

    update() {
        this.updateFrames()
        ctx.fillStyle = 'rgba(96,148,79,0.5)'
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
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
