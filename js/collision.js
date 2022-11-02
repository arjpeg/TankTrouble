function collision(o1, o2) {
    let collided = (o1.x < o2.x + o2.width &&
        o1.x + o1.width > o2.x &&
        o1.y < o2.y + o2.height &&
        o1.y + o1.height > o2.y)

    if (!collided) {
        return false;
    }

    let closestCorner = getNearestVertex(o1, o2)

    let centerX = o1.x + o1.width / 2
    let centerY = o1.y + o1.height / 2

    // is the player is closer to the x?
    if (Math.abs(centerX - closestCorner[0]) < Math.abs(centerY - closestCorner[1]))
        if (o1.xSpeed >= 0)
            return { direction: 'right', vertex: closestCorner, axis: "x" }
        else
            return { direction: 'left', vertex: closestCorner, axis: "x" }
    else
        if (o1.ySpeed > 0)
            return { direction: 'down', vertex: closestCorner, axis: "y" }
        else
            return { direction: 'up', vertex: closestCorner, axis: "y" }
}

function getNearestVertex(o1, o2) {
    // Get the nearest vertex of an o2, and return the point
    // get the closer side to the top
    let closerToTop = Math.abs(o2.y - o1.y) < Math.abs(o1.y - (o2.y + o2.height))

    // Are we on the left side of the o2?
    if (o1.x < o2.x) {
        return closerToTop ? [o2.x, o2.y] : [o2.x, o2.y + o2.height]
    }
    // we are on the right side of the o2
    else {
        //                                                 
        return closerToTop ?
            [o2.x + o2.width, o2.y]  // top-right
            : [o2.x + o2.width, o2.y + o2.height] // bottom-left

    }
}