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

var next = function (neighbourhood, iteration, random, probability) {
    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
            if (random == 1) {
                if (Math.random() < probability) {
                    continue;
                }
            }
            switch (neighbourhood) {
                case 1:
                    matrix[i][j].state = moore(i, j);
                    break;
                case 2:
                    matrix[i][j].state = neumann(i, j);
                    break;
                case 3:
                    matrix[i][j].state = (j % 2 ? moore(i, j) : neumann(i, j));
                    break;
                case 4:
                    matrix[i][j].state = (j % 4 ? neumann(i, j) : moore(i, j));
                    break;
                case 5:
                    matrix[i][j].state = (j % 4 ? moore(i, j) : neumann(i, j));
                    break;
                case 6:
                    matrix[i][j].state = (iteration % 2 ? moore(i, j) : neumann(i, j));
                    break;
                case 7:
                    matrix[i][j].state = (iteration % 4 ? neumann(i, j) : moore(i, j));
                    break;
                case 8:
                    matrix[i][j].state = (iteration % 4 ? moore(i, j) : neumann(i, j));
                    break;
                case 9:
                    matrix[i][j].state = rectangular(i, j, iteration);
                    break;
            }
        }
    }
    saveOldStates();
}

var nextRandom2 = function(probability) {
    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
            if (Math.random() < probability) {
                matrix[i][j].state = moore(i, j);
            } else {
                matrix[i][j].state = neumann(i, j);
            }
        }
    }
    saveOldStates();
}

var nextRandom3 = function(probability) {
    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
            matrix[i][j].state = random3(i, j, probability);
        }
    }
    saveOldStates();
}

var frame = function (neighbourhood, y, random, probability) {
    if (random == 0 || random == 1) {
        next(neighbourhood, y, random, probability);
    } else if (random == 2) {
        nextRandom2(probability);
    } else if (random == 3) {
        nextRandom3(probability);
    }
    updateCanvas();
    if  (y < 100) {
        window.requestAnimationFrame(() => { 
            frame(neighbourhood, y + 1, random, probability);
        });
    }
}

var start = function () {
    updateCanvas();
    $('#error-message').addClass('d-none');
    var neighbourhood = $('#neighbourhood option:selected').val();
    var random = $('#random option:selected').val();
    var probability = 0;
    if (+random == 1) {
        probability = +$('#random1-probability').val() || 0;
    } else if (+random == 2) {
        probability = +$('#random2-probability').val() || 0;
    } else if (+random == 3) {
        let probabilityVertical = +$('#vertical-probability').val() || 0;
        let probabilityHorizontal = +$('#horizontal-probability').val() || 0;
        let probabilityDiagonal1 = +$('#diagonal1-probability').val() || 0;
        let probabilityDiagonal2 = +$('#diagonal2-probability').val() || 0;

        probability = [probabilityVertical, probabilityHorizontal, probabilityDiagonal1, probabilityDiagonal2];
    }
    window.requestAnimationFrame(() => { 
        frame(+neighbourhood, 1, random, probability);
    });
}

var saveOldStates = function() {
    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
            matrix[i][j].oldState = matrix[i][j].state;
        }
    }
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

$("#random").change(function() {
    $('#neighbourhood').removeAttr('disabled');
    $('#random1-container').addClass('d-none');
    $('#random2-container').addClass('d-none');
    $('#random3-container').addClass('d-none');
    if (+$('#random option:selected').val() == 1) {
        $('#random1-container').removeClass('d-none');
    } else if (+$('#random option:selected').val() == 2) {
        $('#random2-container').removeClass('d-none');
        $('#neighbourhood').attr('disabled', true);
    } else if (+$('#random option:selected').val() == 3) {
        $('#random3-container').removeClass('d-none');
        $('#neighbourhood').attr('disabled', true);
    } 
});