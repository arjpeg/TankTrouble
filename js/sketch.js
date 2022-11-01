let player;
let walls = [];
let offSetX
let offSetY

function setup() {
    createCanvas(1920, 1080);
    walls = [
        new Wall(100, 100, 100, 70),
        new Wall(190, 50, 100, 80)
    ]

    player = new Player(walls);
}

function draw() {
    background(238, 238, 238)

    offSetX = Math.max(-width / 2, (player.pos.x + player.width / 2) - width / 2)
    offSetY = (player.pos.y + player.height / 2) - height / 2

    scale(1.25)
    translate(-offSetX, -offSetY)
    player.draw();
    player.update();


    for (let wall of walls) {
        wall.draw()
    }


    let allBullets = [...player.bullets]

    allBullets.forEach(bullet => {
        if (bullet.age > 50 && player.collidedWith(bullet)) {
            player.health -= 1
            console.log("E");

            player.bullets.splice(bullet, 1)
        }
    });
}

function mouseClicked() {
    player.shoot()
}