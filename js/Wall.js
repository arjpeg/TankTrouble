class Wall {
    constructor(x, y, width, height) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height

        this.hitbox = {
            x: x,
            y: y,
            width: width,
            height: height
        }
    }

    draw() {
        this.hitbox.x = Math.floor(this.x - offSetX)
        this.hitbox.y = this.y - offSetY

        push()
        strokeWeight(3)
        rect(this.hitbox.x, this.hitbox.y, this.width, this.height)
        pop()
    }
}