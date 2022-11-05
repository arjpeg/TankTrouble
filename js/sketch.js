let player
let walls = []

let offSetX
let offSetY

let enemyTanks = []

const ws = new WebSocket("ws://localhost:8001")

ws.onopen = (e) => console.log("Client successfully connected!")
ws.onerror = (e) => alert("There was a problem connecting to the server... Please try again later.")
ws.onmessage = (message) => {
    let event = JSON.parse(message.data)
    console.log(event.type);

    if (event.type == "wallData") {
        // Loop through all the walls and set them
        for (const wallPos of event.walls) {
            let { x, y, width, height } = wallPos;
            walls.push(new Wall(x, y, width, height))
        }
    }
}

function setup() {
    createCanvas(1920, 1080);
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