import {ctx, canvas, SCALE_NUMBER} from "./index.js"
import {collision} from "./collision.js"

class CollisionBlock {
    constructor({position, height = 16}) {
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
        this.loaded = false
        this.image = new Image()
        this.image.onload = () => {
            this.width = (this.image.width / this.frameRate) * this.scale
            this.height = (this.image.height) * this.scale
            this.loaded = true
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
    constructor({position, velocity, collisionBlocks, imageSrc, frameRate, scale = 0.5, animations}) {
        super({position, imageSrc, frameRate, scale})
        this.position = position
        this.velocity = velocity
        this.gravity = 0.5
        this.collisionBlocks = collisionBlocks
        this.hitbox = {
            position: {
                x: this.position.x,
                y: this.position.y,
            },
            width: 10,
            height: 10,
        }
        this.animations = animations
        this.lastDirection = 'right'

        for (const animationName in this.animations) {
            const image = new Image()
            image.src = this.animations[animationName].imageSrc

            this.animations[animationName].image = image
        }
    }

    switchSprite(animationName) {
        if (this.image === this.animations[animationName].image || !this.loaded) {
            return
        }

        this.image = this.animations[animationName].image
        this.frameRate = this.animations[animationName].frameRate
        this.frameBuffer = this.animations[animationName].frameBuffer
    }

    update() {
        this.updateFrames()
        // //draws out the image
        // ctx.fillStyle = 'rgba(0,255,0,0.2)'
        // ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
        // //draws out the hitbox rectangle
        // ctx.fillStyle = 'rgba(255,0,0,0.2)'
        // ctx.fillRect(this.hitbox.position.x, this.hitbox.position.y, this.hitbox.width, this.hitbox.height)

        this.draw()
        this.position.x += this.velocity.x
        this.updateHitbox()
        this.checkForHorizontalCollision()
        this.applyGravity()
        this.updateHitbox()
        this.checkForVerticalCollision()
    }

    updateHitbox() {
        this.hitbox = {
            position: {
                x: this.position.x + 35,
                y: this.position.y + 26,
            },
            width: 14,
            height: 27,
        }
    }

    checkForHorizontalCollision() {
        for (let i = 0; i < this.collisionBlocks.length; i++) {
            const collisionBlock = this.collisionBlocks[i]

            if (collision({object1: this.hitbox, object2: collisionBlock})) {
                if (this.velocity.x > 0) {
                    this.velocity.x = 0

                    const offset = this.hitbox.position.x - this.position.x + this.hitbox.width

                    this.position.x = collisionBlock.position.x - offset - 0.01
                    break
                }

                if (this.velocity.x < 0) {
                    this.velocity.x = 0

                    const offset = this.hitbox.position.x - this.position.x

                    this.position.x = collisionBlock.position.x + collisionBlock.width - offset + 0.01
                    break
                }
            }
        }
    }

    applyGravity() {
        this.velocity.y += this.gravity
        this.position.y += this.velocity.y
    }

    checkForVerticalCollision() {
        for (let i = 0; i < this.collisionBlocks.length; i++) {
            const collisionBlock = this.collisionBlocks[i]

            if (collision({object1: this.hitbox, object2: collisionBlock})) {
                if (this.velocity.y > 0) {
                    this.velocity.y = 0

                    const offset = this.hitbox.position.y - this.position.y + this.hitbox.height

                    this.position.y = collisionBlock.position.y - offset - 0.01
                    break
                }

                if (this.velocity.y < 0) {
                    this.velocity.y = 0

                    const offset = this.hitbox.position.y - this.position.y

                    this.position.y = collisionBlock.position.y + collisionBlock.height - offset + 0.01
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
