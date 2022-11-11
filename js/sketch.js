let allBullets = []

let player
let walls = []

let offSetX
let offSetY

let enemyTanks = {}
let previousPlayerPos = {}
let lastShotBullet

const START_X = 810, START_Y = 525
const ws = new WebSocket(getHost())

let deaths = {}

let font
let fontBold

function getHost() {
    if (window.location.hostname == "localhost" || window.location.hostname == "127.0.0.1") {
        return "ws://localhost:8001"
    } if (window.location.hostname == "10.0.0.60") {
        return "ws://10.0.0.60:8001"
    } else {
        return "ws://tanktroubleserver-production.up.railway.app/"
    }
}

function genRandomBulletId() {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (let i = 0; i < 10; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

ws.onopen = (e) => {
    console.info("Client successfully connected!")
}

ws.onerror = (e) => alert("There was a problem connecting to the server... Please try again later.")

ws.onmessage = (message) => {
    let event = JSON.parse(message.data)
    console.log(event.type, event);

    if (event.type == "wallData") {
        // Loop through all the walls and set them
        for (const wallPos of event.walls) {
            let { x, y, width, height } = wallPos;
            walls.push(new Wall(x, y, width, height))
        }
    } else if (event.type == "newClient") {
        console.log(`New tank joined: ${event.name}`);
        let { name, x, y, angle } = event

        enemyTanks[name] = new EnemyTank(10, name)
        enemyTanks[name].updatePos(x, y, angle)

        deaths[name] = event['deaths']

    } else if (event.type == "updatePos") {
        let { name, x, y, angle } = event
        enemyTanks[name].updatePos(x, y, angle)
    } else if (event.type == "playerLeave") {
        delete enemyTanks[event.name]
    } else if (event.type == "shoot") {
        let { player, x, y, angle, bulletId } = event
        allBullets.push(new Bullet(x, y, angle, enemyTanks[player].color, bulletId))
    } else if (event.type == "hit") {
        let { player, bulletId } = event
        enemyTanks[player].health -= 1

        // Get the bullet with that id, and delete it
        allBullets.forEach((bullet) => {
            if (bullet.id == bulletId) {
                allBullets.splice(bullet, 1)
            }
        })
    } else if (event.type == "death") {
        let { player } = event
        deaths[player] += 1

        enemyTanks[player].health = 10
    }
}

function sendUpdatedPos() {
    if (previousPlayerPos.x != player.x || previousPlayerPos.y != player.y || previousPlayerPos.angle != player.angle) {
        ws.send(JSON.stringify({
            type: 'updatePos',
            x: player.x,
            y: player.y,
            angle: player.angle
        }))
    }

    previousPlayerPos.x = player.x
    previousPlayerPos.y = player.y
    previousPlayerPos.angle = player.angle

    return
}

function preload() {
    font = loadFont('assets/Poppins-Regular.ttf')
    fontBold = loadFont('assets/Poppins-Bold.ttf')
}

function setup() {
    createCanvas(1920, 1080);
    let name = prompt("Name:") || "player"

    deaths[name] = 0

    player = new Player(walls, 10, name);

    ws.send(JSON.stringify({
        type: 'init',
        name: name,
        x: player.x,
        y: player.y,
        angle: player.angle
    }))

    setInterval(sendUpdatedPos, 200) // Send the server player data, every 1/2 second or so 
}

function draw() {
    background(238, 238, 238)

    let vw = window.innerWidth
    let vh = window.innerHeight

    offSetX = -Math.max(0, (player.x + player.width / 2) - vw / 2)
    offSetY = -Math.max(0, (player.y + player.height / 2) - vh / 2)

    push()

    scale(1.25)
    translate(offSetX, offSetY)

    allBullets.forEach(bullet => {
        bullet.draw()
        bullet.update()

        for (const wall of walls) {
            if (bullet.y < 0 || bullet.y > height) {
                allBullets.splice(bullet, 1)
            } else if (bullet.x < 0 || bullet.x > width) {
                allBullets.splice(bullet, 1)
            } else if (bullet.age > 400) {
                allBullets.splice(bullet, 1)
            }


            let collisionDirection = collision(bullet, wall)
            if (!collisionDirection) { continue }

            if (collisionDirection.axis == "y")
                bullet.ySpeed *= -1
            else
                bullet.xSpeed *= -1
        }

        if (bullet.age > 30 && collision(player, bullet)) {
            player.health -= 1
            allBullets.splice(bullet, 1)

            ws.send(JSON.stringify({
                type: 'hit',
                bulletId: bullet.id
            }))

            if (player.health <= 0) {
                // Reset player pos
                player.x = START_X
                player.y = START_Y

                player.health = 10

                ws.send(JSON.stringify({
                    type: 'death'
                }))

                deaths[player.name]++
            }
        }
    });

    player.draw();
    player.update();

    for (const [_, tank] of Object.entries(enemyTanks)) {
        tank.draw()
    }

    for (let wall of walls) {
        wall.draw()
    }

    pop()

    // Draw death-"leaderboard"
    push()
    let w = vw * 0.15 + 50
    let h = 70 + (Object.keys(deaths).length * 30)

    translate(vw * 0.8, 25)
    strokeWeight(5)
    rect(0, 0, w, h)
    textFont(font)
    textSize(30)
    text("Deaths:", w / 2 - 55, 30)
    textSize(20)

    let i = 0
    for (const [name, deathCount] of Object.entries(deaths)) {
        text(`${name}: ${deathCount}`, 20, 80 + i * 30)
        i++
    }
    pop()
}

function mouseClicked() {
    if (player.bulletCooldown >= player.minBulletCooldown) {

        let bullet = new Bullet(player.x + player.width / 2, player.y + player.height / 2, player.angle, player.color, genRandomBulletId())

        allBullets.push(bullet)
        lastShotBullet = bullet

        player.bulletCooldown = 0

        ws.send(JSON.stringify({
            type: 'shoot',
            x: player.x,
            y: player.y,
            angle: player.angle,
            bulletId: bullet.id
        }))
    }
}