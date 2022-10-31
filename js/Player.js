class Player {
    constructor(walls, health = 10) {
        this.pos = createVector(width / 2, height / 2)
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
    }

    collidedWith(object) {
        let collided = (this.pos.x < object.hitbox.x + object.width &&
            this.pos.x + this.width > object.hitbox.x &&
            this.pos.y < object.hitbox.y + object.height &&
            this.pos.y + this.height > object.hitbox.y)

        if (!collided) {
            return false;
        }

        if (Math.abs(this.xSpeed) > Math.abs(this.ySpeed)) {
            if (this.xSpeed > 0) {
                return 'right'
            } else {
                return 'left'
            }
        } else {
            if (this.ySpeed > 0) {
                return 'down'
            } else {
                return 'up'
            }
        }
    }

    draw() {
        for (let bullet of this.bullets) {
            bullet.update()
            bullet.draw()
        }

        let x = this.pos.x
        let y = this.pos.y

        let w = this.width
        let h = this.height

        strokeWeight(5)


        push()
        rectMode(CENTER);
        fill(color(212, 97, 121))

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
        if (keyIsDown(65)) {
            this.xSpeed = -2;
        } else if (keyIsDown(68)) {
            this.xSpeed = 2;
        } else {
            this.xSpeed = 0
        }

        if (keyIsDown(87)) {
            this.ySpeed = -2;
        } else if (keyIsDown(83)) {
            this.ySpeed = 2;
        } else {
            this.ySpeed = 0
        }

        this.pos.add(this.xSpeed, this.ySpeed);
        this.angle = atan2(mouseY - this.pos.y, mouseX - this.pos.x)

        this.pos.x = Math.max(0, this.pos.x)
        this.pos.x = Math.min(width - this.width, this.pos.x)

        this.pos.y = Math.max(0, this.pos.y)
        this.pos.y = Math.min(height - this.height, this.pos.y)

        for (const wall of this.walls) {
            let collisionDirection = this.collidedWith(wall)

            if (!collisionDirection) {
                continue
            }

            console.log(collisionDirection);

            switch (collisionDirection) {
                case 'right':
                    this.pos.x = wall.hitbox.x - this.width
                    break;
                case 'left':
                    this.pos.x = wall.hitbox.x + wall.width
                    break;
                case 'up':
                    this.pos.y = wall.hitbox.y + wall.height
                    break;
                case 'down':
                    this.pos.y = wall.hitbox.y - this.height
                    break;

                default:
                    break;
            }
        }

        for (let bullet of this.bullets) {
            for (let wall of this.walls) {
                bullet.collidedWith(wall)

                if (bullet.y < 0 || bullet.y > height) {
                    this.bullets.splice(bullet, 1)
                } else if (bullet.x < 0 || bullet.x > width) {
                    this.bullets.splice(bullet, 1)
                } else if (bullet.age > 400) {
                    this.bullets.splice(bullet, 1)
                }
            }
        }

        this.bulletCooldown++
    }

    shoot() {
        if (this.bulletCooldown >= this.minBulletCooldown) {
            this.bullets.push(
                new Bullet(this.pos.x + this.width / 2, this.pos.y + this.height / 2, this.angle)
            )

            this.bulletCooldown = 0
        }
    }
}