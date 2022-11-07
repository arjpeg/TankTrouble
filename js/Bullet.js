class Bullet {
    constructor(x, y, angle, _color, id = null) {
        this.x = x
        this.y = y

        this.angle = angle

        this.xSpeed = 4
        this.ySpeed = 4

        this.width = 16
        this.height = 16

        this.age = 0
        this.color = _color

        this.id = id
    }

    draw() {
        push()
        strokeWeight(3)
        fill(this.color)
        circle(this.x, this.y, this.width)
        pop()
    }

    update() {
        this.x += this.xSpeed * cos(this.angle)
        this.y += this.ySpeed * sin(this.angle)

        this.age++
    }
}
