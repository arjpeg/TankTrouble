let player
let walls = []

let offSetX
let offSetY

function setup() {
    createCanvas(1920, 1080);
    walls = [
        new Wall(100, 100, 200, 200),
        new Wall(1700, 0, 200, 100)
    ]

    player = new Player(walls);
}

function draw() {
    background(238, 238, 238)

    let vw = window.innerWidth
    let vh = window.innerHeight

    offSetX = (player.x + player.width / 2) - vw / 2
    offSetY = (player.y + player.height / 2) - vh / 2

    scale(1.25)
    translate(-Math.max(0, offSetX), -Math.max(0, offSetY))

    player.drawBullets()
    player.draw();

    player.update();
    player.updateBullets()

    for (let wall of walls) {
        wall.draw()
    }


    let allBullets = [...player.bullets]

    allBullets.forEach(bullet => {
        if (bullet.age > 20 && collision(player, bullet)) {
            player.health -= 1
            player.bullets.splice(bullet, 1)
        }
    });
}

function mouseClicked() {
    player.shoot()
}