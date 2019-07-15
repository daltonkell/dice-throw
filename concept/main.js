/* drawing on the game table canvas */

/* TODO NOTE: this was pretty much totally ganked from https://www.kirupa.com/canvas/creating_motion_trails.html, so thanks!
Now need to modify to draw a slightly slower trail, and not a circle -- just a line will do. */

var canvas = document.querySelector("#game-table-canvas");
var context = canvas.getContext("2d");

var canvasPos = getPosition(canvas);
var mouseX = 0;
var mouseY = 0;
var draw = false; // start not drawing

function mouseDownEventHandler(e) {
  /* Only want to draw on a mouseDown event, so when the mouse is
  down, we draw */
  setMousePosition(e);
  draw = true;
  if (draw) {
    update();
  }
}

function mouseUpEventHandler(e) {
  /* Once the mouse is up, no more drawing */
  draw = false;
  context.closePath(e);
}

function mouseLeaveEventHandler(e) {
  /* once the mouse leaves the plane of the canvas, stop drawing */
  draw = false;
  context.closePath(e);
}

function mouseMoveEventHandler(e) {
  setMousePosition(e);
  if (draw){
    update();
  }
}

function setMousePosition(e) {
  mouseX = e.clientX - canvasPos.x;
  mouseY = e.clientY - canvasPos.y;
}

var totalPositionsToStore = 10;
var positions = []; // array to hold previous positions for the motion trail

function storeLastPosition(xPos, yPos) {
  // push onto the array
  positions.push({
    x: xPos,
    y: yPos
  });

  if (positions.length > totalPositionsToStore) {
    positions.shift(); // essentially remove the oldest element
  }
}

function clearCanvas() {
  // TODO implement with button?
  /* Clear any drawing from the canvas */
  context.clearRect(0, 0, cavnas.width, canvas.height);
}

function update() {
  // the trail
  for (var i=0; i<positions.length; ++i) {
    drawCircle(positions[i].x, positions[i].y, i / positions.length); // that ratio defines the opacity of each subsequent circle in trail
  }

  // the leading circle
  drawCircle(mouseX, mouseY, "primary");
  storeLastPosition(mouseX, mouseY);

}


function drawCircle(x, y, a) {
  var alpha;
  var scale;

  // compute alpha channel and scale ratio
  if (a == "primary") {
    alpha = 1;
    scale = 1;
  } else {
    alpha = a/2;
    scale = a;
  }

  context.beginPath();
  context.arc(x, y, scale*10, 0, 2*Math.PI, true);
  context.fillstyle = "rgba(204, 102, 153, " + alpha + ")";
  context.fill();
}

// deal with window getting resized or scrolled
window.addEventListener("scroll", updatePosition, false);
window.addEventListener("resize", updatePosition, false);

function updatePosition() {
  canvasPos = getPosition(canvas);
}

// helper function to get an element's exact position
function getPosition(el) {
  var xPosition = 0;
  var yPosition = 0;

  while (el) {
    if (el.tagName == "BODY") {
      var xScrollPos = el.scrollLeft || document.documentElement.scrollLeft;
      var yScrollPos = el.scrollTop || document.documentElement.scrollTop;
      xPosition += (el.offsetLeft - xScrollPos + el.clientLeft);
      yPosition += (el.offsetTop - yScrollPos + el.clientTop);
    } else {
      xPosition += (el.offsetLeft - el.scrollLeft + el.clientLeft);
      yPosition += (el.offsetTop - el.scrollTop + el.clientTop);
    }

    el = el.offsetParent;
  }
  return {
    x: xPosition,
    y: yPosition
  };
}

canvas.addEventListener("mousemove", mouseMoveEventHandler, false);
canvas.addEventListener('mousedown', mouseDownEventHandler);
canvas.addEventListener('mouseup', mouseUpEventHandler);
canvas.addEventListener('mouseleave', mouseLeaveEventHandler);
