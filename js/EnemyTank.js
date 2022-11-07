class EnemyTank extends BasePlayer {
    constructor(health = 10, name) {
        super(health, undefined, name)
        this.name = name
    }

    updatePos(x, y, angle) {
        this.x = x
        this.y = y

        this.angle = angle
    }
}