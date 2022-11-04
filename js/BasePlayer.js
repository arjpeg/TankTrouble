class BasePlayer {
    constructor(walls, health = 10, color) {
        this.x = 500
        this.y = 500

        this.angle = 0

        this.bullets = []
        this.walls = walls

        this.width = 40
        this.height = 40

        this.maxHealth = health
        this.health = health

        this.xSpeed = 0
        this.ySpeed = 0

        this.minBulletCooldown = 30
        this.bulletCooldown = 0

        this.speed = 2.5

        this.color = color ? color : this.generateRandomColor()
    }

    generateRandomColor() {
        let genRandNum = () => Math.floor(Math.max(50, Math.random() * 256))

        return [genRandNum(), genRandNum(), genRandNum()]
    }

    draw() {
        let x = this.x
        let y = this.y

        let w = this.width
        let h = this.height

        strokeWeight(5)

        push()
        rectMode(CENTER);
        fill(color(this.color))

        push()
        // Draw turret
        translate(x + this.width / 2, y + this.height / 2)
        rotate(this.angle)
        rect(this.height / 2, 0, this.width * 0.6, this.height * 0.6)
        pop()

        // Draw circle
        circle(x + 0.5 * this.width, y + 0.5 * this.height, this.width)
        pop()

        push()
        strokeWeight(3)
        // Draw the oultine
        fill(color(200, 35, 51))
        rect(x, y + h + 17.25, w, 10)

        // Draw health bar (the green part)
        fill(color(40, 167, 69))
        rect(x, y + h + 17.25, w * (this.health / this.maxHealth), 10)
        pop()
    }

    update() {
        this.x = Math.max(0, this.x)
        this.x = Math.min(width - this.width, this.x)

        this.y = Math.max(0, this.y)
        this.y = Math.min(height - this.height, this.y)

        for (const wall of this.walls) {
            let collisionDirection = collision(this, wall)

            if (!collisionDirection) {
                continue
            }

            let { direction, vertex } = collisionDirection

            switch (direction) {
                case 'right':
                    this.x = vertex[0] - this.width
                    break;
                case 'left':
                    this.x = vertex[0]
                    break;
                case 'up':
                    this.y = vertex[1]
                    break;
                case 'down':
                    this.y = vertex[1] - this.height
                    break;

                default:
                    break;
            }
        }
        this.bulletCooldown++
    }

    drawBullets() {
        for (let bullet of this.bullets) {
            bullet.draw()
        }
    }

    updateBullets() {
        for (let bullet of this.bullets) {
            bullet.update()

            for (let wall of this.walls) {
                if (bullet.y < 0 || bullet.y > height) {
                    this.bullets.splice(bullet, 1)
                } else if (bullet.x < 0 || bullet.x > width) {
                    this.bullets.splice(bullet, 1)
                } else if (bullet.age > 400) {
                    this.bullets.splice(bullet, 1)
                }


                let collisionDirection = collision(bullet, wall)

                if (!collisionDirection) { continue }

                if (collisionDirection.axis == "y")
                    bullet.ySpeed *= -1
                else
                    bullet.xSpeed *= -1

            }
        }

    }

    shoot() {
        if (this.bulletCooldown >= this.minBulletCooldown) {
            this.bullets.push(
                new Bullet(this.x + this.width / 2, this.y + this.height / 2, this.angle, this.color)
            )

            this.bulletCooldown = 0
        }
    }
}