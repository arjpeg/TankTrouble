class Bullet {
    constructor(x, y, angle) {
        this.x = x
        this.y = y

        this.angle = angle

        this.xSpeed = 4
        this.ySpeed = 4

        this.r = 16

        this.width = 16
        this.height = 16

        this.age = 0
    }

    draw() {
        push()
        noStroke()
        fill(178, 146, 230)
        circle(this.x, this.y, this.r)
        pop()
    }

    update() {
        this.x += this.xSpeed * cos(this.angle)
        this.y += this.ySpeed * sin(this.angle)

        this.x += this.xSpeed * cos(this.angle)
        this.y += this.ySpeed * sin(this.angle)

        this.age++
    }

    collidedWith(object) {
        let xSpeed = this.xSpeed * cos(this.angle)
        let ySpeed = this.ySpeed * sin(this.angle)

        let collided = (this.x < object.x + object.width &&
            this.x + this.r > object.x &&
            this.y < object.y + object.height &&
            this.y + this.r > object.y)

        if (!collided) {
            return false
        }

        if (Math.abs(xSpeed) > Math.abs(ySpeed)) {
            if (xSpeed > 0) {
                this.x = object.x - this.r
            } else {
                this.x = object.x + object.width
            }

            this.xSpeed *= -1
        } else {
            if (ySpeed > 0) {
                this.y = object.y - this.r
            } else {
                this.y = object.y + object.height
            }

            this.ySpeed *= -1
        }

        return true
    }
}
