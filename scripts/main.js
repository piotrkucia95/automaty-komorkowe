const COLOR_WHITE   = "rgb(255,255,255)";
const COLOR_BLACK   = "rgb(0,0,0)";

const WHITE = 0;
const BLACK = 1;

var size    = 1;

var canvas  = document.getElementById("main-canvas");
var width   = canvas.width;
var height  = canvas.height;
var context = canvas.getContext("2d");

const wolframArray = ["111", "110", "101", "100", "011", "010", "001", "000"];
var indexList;

var line = new Array(width);
for (let i = 0; i < width; i++) {
    line[i] = {
        oldState: i == Math.floor(width/2) ? 1 : 0,
        state:    i == Math.floor(width/2) ? 1 : 0,
    }
}

var rule = function (ruleBinary, left, center, right) {
    var states = left + '' + center + '' + right + '';
    var index = wolframArray.indexOf(states);
    return parseInt(ruleBinary.charAt(index));
}

var nextSync = function (ruleBinary) {
    for(var x = 0; x < width; x++) {
        var top   = line[x    ].oldState ? 1 : 0;
        var right = line[x + 1] && line[x + 1].oldState ? 1 : 0;
        var left  = line[x - 1] && line[x - 1].oldState ? 1 : 0;
        line[x].state = rule(ruleBinary, left, top, right);
    }
    for(var x = 0; x < width; x++) {
        line[x].oldState = line[x].state;
    }
}

var nextAsync1 = function (ruleBinary) {
    for(var x = 0; x < width; x++) {
        var top   = line[x    ].state ? 1 : 0;
        var right = line[x + 1] && line[x + 1].state ? 1 : 0;
        var left  = line[x - 1] && line[x - 1].state ? 1 : 0;
        line[x].state = rule(ruleBinary, left, top, right);
    }
}

var nextAsync2 = function (ruleBinary) {
    if (!indexList) indexList = createIndexList();
    for(var x = 0; x < width; x++) {
        var top   = line[indexList[x]].state ? 1 : 0;
        var right = line[indexList[x] + 1] && line[indexList[x] + 1].state ? 1 : 0;
        var left  = line[indexList[x] - 1] && line[indexList[x] - 1].state ? 1 : 0;
        line[indexList[x]].state = rule(ruleBinary, left, top, right);
    }
}

var nextAsync3 = function (ruleBinary) {
    indexList = createIndexList();
    for(var x = 0; x < width; x++) {
        var top   = line[indexList[x]].state ? 1 : 0;
        var right = line[indexList[x] + 1] && line[indexList[x] + 1].state ? 1 : 0;
        var left  = line[indexList[x] - 1] && line[indexList[x] - 1].state ? 1 : 0;
        line[indexList[x]].state = rule(ruleBinary, left, top, right);
    }
}

var drawLine = function (line, y){
    for(var x = 0; x < width; x++){
        context.fillStyle = line[x].state ? COLOR_BLACK : COLOR_WHITE;
        context.fillRect(x * size, y * size, size, size);
    }
}

var frame = function (next, ruleBinary, y) {
    next(ruleBinary);
    drawLine(line, y);
    if  (y < height - 1) {
        window.requestAnimationFrame(() => { 
            frame(next, ruleBinary, y + 1 ) 
        });
    }
}

var start1 = function () {
    drawLine(line, 0);
    var ruleBinary;
    $('#error-message-sync').addClass('d-none');
    var rule = $("input[name='rule-radio-sync']:checked").val();
    switch (rule) {
        case "rule30":
            ruleBinary = "00011110";
            break;
        case "rule90":
            ruleBinary = "01011010";
            break;
        case "rule110":
            ruleBinary = "01101110";
            break;
        case "rule184":
            ruleBinary = "10111000";
            break;
        default:
            $('#error-message-sync').removeClass('d-none');
            return
    }

    window.requestAnimationFrame(() => { 
        frame(nextSync, ruleBinary, 1);
    });
}

var start2 = function () {
    drawLine(line, 0);
    var ruleBinary;
    $('#error-message-sync').addClass('d-none');
    var rule = $("input[name='rule-radio-async']:checked").val();
    switch (rule) {
        case "rule30":
            ruleBinary = "00011110";
            break;
        case "rule90":
            ruleBinary = "01011010";
            break;
        default:
            $('#error-message-async').removeClass('d-none');
            return
    }

    window.requestAnimationFrame(() => { 
        frame(nextAsync1, ruleBinary, 1);
    });
}

var start3 = function () {
    drawLine(line, 0);
    window.requestAnimationFrame(() => { 
        frame(nextAsync2, "01011010", 1);
    });
}

var start4 = function () {
    drawLine(line, 0);
    window.requestAnimationFrame(() => { 
        frame(nextAsync3, "01011010", 1);
    });
}

var clearCanvas = function () {
    context.clearRect(0, 0, width, height);
    for (let i = 0; i < width; i++) {
        line[i] = {
            oldState: i == Math.floor(width/2) ? 1 : 0,
            state:    i == Math.floor(width/2) ? 1 : 0,
        }
    }
}

var createIndexList = function() {
    var newIndexList = new Array(width);
    for (let i = 0; i < width; i++) {
        let index = Math.floor(Math.random() * width);
        if (!newIndexList.includes(index)) {
            newIndexList[i] = index;
        } else {
            i--;
        }
    }
    return newIndexList;
}