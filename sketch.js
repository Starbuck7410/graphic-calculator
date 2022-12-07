// Offsets, settings and shit.
let funcInput, clearButton, saveButton, myCanvas
let canvScale = 0.01
let offsetX = 0
let offsetY = 0
let unitScale = 1


// These are needed for touch support
let touchDX = 0
let touchDY = 0
let touchDdist = 0
let momentumX = 0
let momentumY = 0
let touches = 0

// Setting up constants for use in functions TODO move these to another file as well
let e = 2.71828182845904
let pi = 3.14159265359
let g = 9.81
// let phi = (1 + sqrt(5) / 2)

// Settings
let mouseMomentum = false


function setup() {
  createCanvas(800, 800)
  stroke(255)
  fill(255)
  textSize(15);
  makeUI()
  myCanvas = document.getElementById("defaultCanvas0")

}

function draw() {
  // Handles momentum for touch drag
  offsetX -= momentumX
  momentumX -= momentumX * 0.1
  offsetY -= momentumY
  momentumY -= momentumY * 0.1

  background(32, 31, 30)

  // Handle units being too small / too big
  if (int(unitScale / canvScale) < width / 10) {
    unitScale *= 2
  }
  if (int(unitScale / canvScale) > width / 5) {
    unitScale /= 2
  }

  // Calculate unit distances in px
  let unitDist = int(unitScale / canvScale)

  stroke(100)

  // Draw y axis lines TODO values
  for (let y = -width / 2; y < height / 2; y++) {
    if ((y + int(offsetY)) % unitDist == 0) {
      if (y + int(offsetY) == 0) {
        stroke(255, 255, 255)
      }
      line(0, width / 2 + y, width, width / 2 + y)
      stroke(100)
      // text(round((-y - offsetY) * scaleY), 10, width / 2 + y - 10);
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
    if ((x + int(offsetX)) % unitDist == 0) {
      if (x + int(offsetX) == 0) {
        stroke(255, 255, 255)
      }
      line(realX, 0, realX, height)
    }

    // Draw function
    stroke(255, 150, 150)
    line(prevX, prevY, realX, realY)
  }
}

function f(x) {
  x = (canvScale * x) + (offsetX * canvScale)
  try {
    func = eval(funcInput.value())
  } catch (e) {
    return (Infinity)
  }
  return func / canvScale + offsetY
}

function mouseDragged(event) {
  offsetX -= event.movementX
  offsetY -= event.movementY
  return false
}

function touchStarted(event) {
  touchDX = event.touches[0].screenX
  touchDY = event.touches[0].screenY
  if (event.touches.length == 1) {
    touches = 1
  }
}

function touchMoved(event) {
  if (event.touches.length > 1) {
    let currentDist = sqrt(abs((event.touches[0].screenX - event.touches[1].screenX) ** 2 + (event.touches[0].screenY - event.touches[1].screenY) ** 2))
    if (touches == 2) {
      canvScale *= (touchDdist / currentDist)
    }
    touches = 2
    touchDdist = currentDist
  } else {
    if (touches == 2) return false
    touches = 1
    momentumX = event.touches[0].screenX - touchDX
    momentumY = event.touches[0].screenY - touchDY
    touchDX = event.touches[0].screenX
    touchDY = event.touches[0].screenY
  }
  return false
}

function mouseWheel(event) {
  let delta = event.delta / 1000
  canvScale = canvScale + canvScale * delta
  offsetX = offsetX - offsetX * delta
  offsetY = offsetY - offsetY * delta
  return false
}

function copyCanvas(canv) {
  canv.toBlob((blob) => {
    const item = new ClipboardItem({ "image/png": blob });
    navigator.clipboard.write([item]);
  });
}

function makeUI() {
  let styling = "position: relative; padding-top: auto; padding-right: auto; padding-left: auto; top:30px; left: 0px; z-index: -1; margin-right: 5px; margin-left: 5px"
  funcInput = createInput('x');
  funcInput.position(20, height + 20);
  clearButton = createButton('Clear');
  clearButton.mousePressed(() => funcInput.value(''));
  saveButton = createButton('Copy');
  funcInput.style(styling)
  clearButton.style(styling)
  saveButton.style(styling)
  saveButton.mousePressed(() => copyCanvas(myCanvas));
}
