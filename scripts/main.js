var canvas  = document.getElementById("main-canvas");
var width   = canvas.width;
var height  = canvas.height;
var context = canvas.getContext("2d");
var canvasData = context.createImageData(width, height);

var matrix;
var ncells;
var icells;
var grains = [{
    center: [200, 200],
    cells: [[200, 200]]
}];

var startTime;
var endTime;

var grainGrowthRate = function(ic, jc, ig, jg, inx, jnx) {
    var lc = Math.sqrt(Math.pow((ic - ig), 2) + Math.pow((jc - jg), 2));
    var ln = Math.sqrt(Math.pow((inx - ig), 2) + Math.pow((jnx - jg), 2));
    var time = lc - ln;
    return (+matrix[inx][jnx].time + (1.1 * time));
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

var next = function (y) {
    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
            if (!matrix[i][j].state && moore(i, j)) {
                grains[0].cells.push([i, j]);
                matrix[i][j].state = 1;
                matrix[i][j].grain = 1;
                matrix[i][j].time = grainGrowthRate(i, j, grains[0].center[0], grains[0].center[1], moore(i, j)[0], moore(i, j)[1]);
            }
        }
    }
    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
            if (matrix[i][j].state == 1) {
                if (matrix[i][j].time <= y) {
                    icells++;
                    matrix[i][j].state = 2;
                    drawPixel(i, j, 0, 0, 0, 255);
                }
            }
        }
    }
}

var frame = function (y) {
    next(y);
    updateCanvas();
    if  (icells < ncells) {
        window.requestAnimationFrame(() => { 
            frame(y + 1);
        });
    } else {
        endTime = performance.now();
        $('#simulation-time').text('Obliczenia trwały ' + Math.round(((endTime - startTime) + Number.EPSILON) * 100) / 100  + ' ms');
    }
}

var start = function () {
    startTime = performance.now();
    initMatrix();
    updateCanvas();
    window.requestAnimationFrame(() => { 
        frame(1);
    });
}

var initMatrix = function() {
    matrix = new Array(width);
    for (let i = 0; i < width; i++) {
        matrix[i] = new Array(height);
        for (let j = 0; j < height; j++) {
            isMiddle = (i == Math.floor(width/2) && j == Math.floor(height/2));
            drawPixel(i, j, isMiddle ? 0 : 255, isMiddle ? 0 : 255, isMiddle ? 0 : 255, 255)
            matrix[i][j] = {
                state: isMiddle ? 2 : 0,
                grainNumber: isMiddle ? 1 : 0,
                time: 0
            }
        }
    }
    icells = 1;
    ncells = width * height;
}

var clearCanvas = function () {
    context.clearRect(0, 0, width, height);
    $('#simulation-time').text('');
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