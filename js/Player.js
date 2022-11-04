class Player extends BasePlayer {
    constructor(walls, health = 10, color = [212, 97, 121]) {
        super(walls, health, color)
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

        this.angle = atan2(mouseY / 1.25 - this.y, mouseX / 1.25 - this.x)

        this.x = Math.max(0, this.x)
        this.x = Math.min(width - this.width, this.x)

        this.y = Math.max(0, this.y)
        this.y = Math.min(height - this.height, this.y)

        super.update()
    }
}