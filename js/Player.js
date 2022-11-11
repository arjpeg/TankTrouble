class Player extends BasePlayer {
    constructor(walls, health = 10, name) {
        super(health, [212, 97, 121], name)

        this.bullets = []
        this.walls = walls

        this.x = START_X
        this.y = START_Y

        this.name = name

        this.minBulletCooldown = 30
        this.bulletCooldown = 0
    }

    update() {
        if (keyIsDown(65)) {
            this.xSpeed = -this.speed;
        } else if (keyIsDown(68)) {
            this.xSpeed = this.speed;
        } else {
            this.xSpeed = 0
        }

        if (keyIsDown(87)) {
            this.ySpeed = -this.speed;
        } else if (keyIsDown(83)) {
            this.ySpeed = this.speed;
        } else {
            this.ySpeed = 0
        }

        this.x += this.xSpeed
        this.y += this.ySpeed

        this.angle = atan2(mouseY / 1.25 - this.y - offSetY, mouseX / 1.25 - this.x - offSetX)

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

    // shoot() {

    // }
}