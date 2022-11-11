class Wall {
    constructor(x, y, width, height) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height

    }

    draw() {
        push()
        strokeWeight(3)
        fill(color(248, 246, 241))
        rect(this.x, this.y, this.width, this.height)
        pop()
    }
}