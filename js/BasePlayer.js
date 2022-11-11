class BasePlayer {
    constructor(health = 10, color, name) {
        this.x = 500
        this.y = 500

        this.angle = 0

        this.width = 40
        this.height = 40

        this.maxHealth = health
        this.health = health

        this.xSpeed = 0
        this.ySpeed = 0

        this.speed = 2.5
        this.color = color ? color : this.generateRandomColor()

        this.name = name
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

        // Draw the name
        push()
        rectMode(CENTER)
        textSize(20)
        textFont(font);
        text(this.name, x, y - 15);
        pop()
    }

}