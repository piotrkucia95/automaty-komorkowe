var canvas;
var context;
var canvasWidth;
var canvasHeight;
var canvasData;

function initialzeCanvas (width, height) {
    canvas = document.getElementById("main-canvas");
    context = canvas.getContext("2d");
    canvasData = context.createImageData(width, height);
    canvasWidth = canvas.width;
    canvasHeight = canvas.height;
}

function drawPixel (x, y, r, g, b, a) {
    var index = (x + y * canvasWidth) * 4;

    canvasData.data[index]     = r;  // Red
    canvasData.data[index + 1] = g;  // Green
    canvasData.data[index + 2] = b;  // Blue
    canvasData.data[index + 3] = a;  // Alpha
}

function updateCanvas () {
    context.putImageData(canvasData, 0, 0);
}