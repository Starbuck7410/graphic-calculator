// Offsets, settings and shit. TODO: Move these to another file
let scaleX = 0.01
let scaleY = 0.01
let offsetX = 0
let offsetY = 0
let unitScale = 1

// These are needed for touch support. will be used later.
let touchDX = 0
let touchDY = 0

// Setting up constants for use in functions TODO move these to another file as well
let e = 2.71828182845904
let pi = 3.14159265359
let g = 9.81
let phi = (1 + sqrt(5) / 2)


function setup() {
  createCanvas(600, 600)
  stroke(255)
  background(0)
}



function draw() {

  // Handle units being too small / too big
  if (int(unitScale / scaleX) < width / 10) {
    unitScale *= 2
  }
  if (int(unitScale / scaleX) > width / 5) {
    unitScale /= 2
  }

  // Calculate unit distances in px
  let unitDistX = int(unitScale / scaleX)
  let unitDistY = int(unitScale / scaleY)

  stroke(100)

  // Draw y axis lines TODO values
  for (let y = -width / 2; y < height / 2; y++) {
    if ((y + int(offsetY)) % unitDistY == 0) {
      if (y + int(offsetY) == 0) {
        stroke(255, 255, 255)
      }
      line(0, width / 2 + y, width, width / 2 + y)
      stroke(100)
    }
  }



  for (let x = -width / 2; x < width / 2; x++) {
    // Calculate current and previous coords to draw function line
    let realX = (width / 2) + x
    let realY = (height / 2) - f(x)
    let prevX = (width / 2) + (x - 1)
    let prevY = (height / 2) - f(x - 1)

    // Draw x axis grid lines
    stroke(100)
    if ((x + int(offsetX)) % unitDistX == 0) {
      if (x + int(offsetX) == 0) {
        stroke(255, 255, 255)
      }
      line(realX, 0, realX, height)
    }

    // Draw function
    stroke(255)
    line(prevX, prevY, realX, realY)
  }
}


function f(x) {
  x = (scaleY * x) + (offsetX * scaleX)
  func = (e ** x)
  return func / scaleX + offsetY
}

function mouseDragged(event) {

  offsetX -= event.movementX
  offsetY -= event.movementY
  background(0)
  return false
}


function touchMoved(event) {
  if (sqrt((event.touches[0].screenX - touchDX) ** 2 + (event.touches[0].screenY - touchDY) ** 2) > 50) {
    touchDX = event.touches[0].screenX
    touchDY = event.touches[0].screenY
    return false
  }

  offsetX -= event.touches[0].screenX - touchDX
  offsetY -= event.touches[0].screenY - touchDY
  touchDX = event.touches[0].screenX
  touchDY = event.touches[0].screenY
  background(0)
  return false
}

function mouseWheel(event) {
  let delta = event.delta / 1000
  scaleX = scaleX + scaleX * delta
  scaleY = scaleY + scaleY * delta
  offsetX = offsetX - offsetX * delta
  offsetY = offsetY - offsetY * delta
  background(0)

  return false
}
