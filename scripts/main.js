var canvas  = document.getElementById("main-canvas");
var width   = canvas.width;
var height  = canvas.height;
var context = canvas.getContext("2d");
var canvasData = context.createImageData(width, height);

var matrix = new Array(width);
for (let i = 0; i < width; i++) {
    matrix[i] = new Array(height);
    for (let j = 0; j < height; j++) {
        isMiddle = (i == Math.floor(width/2) && j == Math.floor(height/2));
        drawPixel(i, j, isMiddle ? 0 : 255, isMiddle ? 0 : 255, isMiddle ? 0 : 255, 255)
        matrix[i][j] = {
            state: isMiddle ? 1 : 0,
            oldState: isMiddle ? 1 : 0
        }
    }
}

function moore (x, y) {
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i == 0 && j == 0) continue;
            if (x + i < 0 || x + i > width -1 || y + j < 0 || y + j > height - 1) continue;
            if (matrix[x + i][y + j].oldState) {
                drawPixel(x, y, 0, 0, 0, 255);
                return 1;
            }
        }
    }
    return 0;
}

function neumann (x, y) {
    for (let i = -1; i <= 1; i++) {
        if (i == 0) continue;
        if (x + i < 0 || x + i > width - 1) continue;
        if (y + i < 0 || y + i > height - 1) continue;
        if (matrix[x + i][y].oldState || matrix[x][y + i].oldState) {
            drawPixel(x, y, 0, 0, 0, 255);
            return 1;
        }
    }
    return 0;
}

var next = function (neighbourhood) {
    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
            matrix[i][j].state = neighbourhood == 'moore' ? moore(i, j) : neumann(i, j);
        }
    }
    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
            matrix[i][j].oldState = matrix[i][j].state;
        }
    }
}

var frame = function (neighbourhood, y) {
    next(neighbourhood);
    updateCanvas();
    if  (y < 100) {
        window.requestAnimationFrame(() => { 
            frame(neighbourhood, y + 1);
        });
    }
}

var start = function () {
    updateCanvas();
    $('#error-message').addClass('d-none');
    var neighbourhood = $("input[name='neighbourhood']:checked").val();
    if (!neighbourhood) {
        $('#error-message').removeClass('d-none');
        return;
    };
    window.requestAnimationFrame(() => { 
        frame(neighbourhood, 1);
    });
}

var clearCanvas = function () {
    context.clearRect(0, 0, width, height);
    for (let i = 0; i < width; i++) {
        matrix[i] = new Array(height);
        for (let j = 0; j < height; j++) {
            isMiddle = (i == Math.floor(width/2) && j == Math.floor(height/2));
            drawPixel(i, j, isMiddle ? 0 : 255, isMiddle ? 0 : 255, isMiddle ? 0 : 255, 255)
            matrix[i][j] = {
                state: isMiddle ? 1 : 0,
                oldState: isMiddle ? 1 : 0
            }
        }
    }
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