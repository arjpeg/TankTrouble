class EnemyTank extends BasePlayer {
    constructor(walls, health = 10) {
        super(walls, health)
    }

    updatePos(x, y) {
        this.x = x
        this.y = y
    }
}