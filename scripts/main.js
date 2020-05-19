var canvas  = document.getElementById("main-canvas");
var width   = canvas.width;
var height  = canvas.height;
var context = canvas.getContext("2d");
var canvasData = context.createImageData(width, height);

var matrix;
var grains;
var ncells;
var icells;

function neumann (x, y) {
    for (let i = -1; i <= 1; i++) {
        if (i == 0) continue;
        if (x + i < 0 || x + i > width - 1) continue;
        if (y + i < 0 || y + i > height - 1) continue;
        if (matrix[x + i][y].state == 2) {
            return [x + i, y];
        } else if (matrix[x][y + i].state == 2) {
            return [x, y + i];
        }
    }
    return false;
}

function moore (x, y) {
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i == 0 && j == 0) continue;
            if (x + i < 0 || x + i > width -1 || y + j < 0 || y + j > height - 1) continue;
            if (matrix[x + i][y + j].state == 2) {
                return [x + i, y + j];
            }
        }
    }
    return false;
}

var next = function (neighbourhood, y) {
    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
            let neighbours = (neighbourhood ? neumann(i, j) : moore(i, j));
            if (!matrix[i][j].state && neighbours) {
                matrix[i][j].grain = matrix[neighbours[0]][neighbours[1]].grain;
                matrix[i][j].state = 1;
            }
        }
    }
    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
            if (matrix[i][j].state == 1) {
                icells++;
                matrix[i][j].state = 2;
                drawPixel(i, j, grains[matrix[i][j].grain].color[0], grains[matrix[i][j].grain].color[1], grains[matrix[i][j].grain].color[2], 255);
            }
        }
    }
}

var frame = function (neighbourhood, y) {
    next(neighbourhood, y);
    updateCanvas();
    if  (icells < ncells - 4) {
        window.requestAnimationFrame(() => { 
            frame(neighbourhood, y + 1);
        });
    }
}

var start = function () {
    if (!grains.length) {
        $('#start-error').text('Przed rozpoczęciem symulacji dodaj zarodki ziaren.');
    } else {
        disableInputs();
        var neighbourhood = +$('#neighbourhood option:selected').val();
        window.requestAnimationFrame(() => { 
            frame(neighbourhood, 1);
        });
        $('#start-error').text('');
    }
}

function addNucleon (xIndex, yIndex, size, shape) {
    var pixelColor = getRandomColor();
    grains.push({
        center: [xIndex, yIndex],
        cells : [[xIndex, yIndex]],
        color : pixelColor
    });

    var leftIncrease = Math.floor(size / 2);
    var righIncrease = size % 2 == 0 ? leftIncrease-1 : leftIncrease;
    if (shape == 0) shape = Math.round((Math.random() * 1) + 1);

    if (shape == 1 && size > 1) {
        var r = leftIncrease;
        for (var i = -r; i <= r; i++) {
            for (var j = -r; j <= r; j++) {
                if (xIndex + i < width && xIndex + i >= 0 && yIndex + j < height && yIndex + j >= 0) {
                    var d = (i / r) * (i / r) + (j / r) * (j / r); 
                    if (d < 1.08) {
                        icells++;
                        matrix[xIndex + i][yIndex + j].state = 2;
                        matrix[xIndex + i][yIndex + j].grain = grains.length - 1;
                        drawPixel(xIndex + i, yIndex + j, pixelColor[0], pixelColor[1], pixelColor[2], 255);
                    }
                }
            }
        }
    } else if (shape == 2 || size == 1) {
        for (var i = -leftIncrease; i <= righIncrease; i++) {
            for (var j = -leftIncrease; j <= righIncrease; j++) {
                if (xIndex + i < width && xIndex + i >= 0 && yIndex + j < height && yIndex + j >= 0) {
                    icells++;
                    matrix[xIndex + i][yIndex + j].state = 2;
                    matrix[xIndex + i][yIndex + j].grain = grains.length - 1;
                    drawPixel(xIndex + i, yIndex + j, pixelColor[0], pixelColor[1], pixelColor[2], 255);
                }
            }
        }
    }
}

var initMatrix = function() {
    matrix = new Array(width);
    grains = [];
    for (let i = 0; i < width; i++) {
        matrix[i] = new Array(height);
        for (let j = 0; j < height; j++) {
            matrix[i][j] = {
                grain: 0,
                state: 0
            }
        }
    }
    icells = 1;
    ncells = width * height;
}

var clearCanvas = function () {
    initMatrix();
    enableInputs();
    context.clearRect(0, 0, width, height);
    canvasData = context.createImageData(width, height);
}

function drawPixel (x, y, r, g, b, a) {
    var index = (x + y * width) * 4;

    canvasData.data[index]     = r;  // Red
    canvasData.data[index + 1] = g;  // Green
    canvasData.data[index + 2] = b;  // Blue
    canvasData.data[index + 3] = a;  // Alpha
}

function updateCanvas () {
    context.putImageData(canvasData, 0, 0);
}

initMatrix();