const COLOR_WHITE   = "rgb(255,255,255)";
const COLOR_BLACK   = "rgb(0,0,0)";

const WHITE = 0;
const BLACK = 1;

var size    = 1;

var canvas  = document.getElementById("main-canvas");
var width   = canvas.width;
var height  = canvas.height;
var context = canvas.getContext("2d");

var wolframArray = ["111", "110", "101", "100", "011", "010", "001", "000"];

var line = new Array(width);
line[Math.floor(width/2)] = 1;

var rule = function (ruleBinary, left, center, right) {
    var states = left + '' + center + '' + right + '';
    var index = wolframArray.indexOf(states);
    return parseInt(ruleBinary.charAt(index));
}

var next = function (ruleBinary, line){
    var next = new Array(width);
    for(var x = 0; x < width; x++){
        var top   = line[x    ] ? 1 : 0;
        var right = line[x + 1] ? 1 : 0;
        var left  = line[x - 1] ? 1 : 0;

        next[x] = rule(ruleBinary, left, top, right);
    }
    return next;
}

var drawLine = function (line, y){
    for(var x = 0; x < width; x++){
        context.fillStyle = line[x] ? COLOR_BLACK : COLOR_WHITE;
        context.fillRect(x * size, y * size, size, size);
    }
}

var frame = function (ruleBinary, y) {
    line = next(ruleBinary, line);
    drawLine(line, y);
    if  (y < height - 1) {
        window.requestAnimationFrame(function() { frame(ruleBinary, y + 1 ) });
    }
}

var start1 = function () {
    drawLine(line, 0);
    var ruleBinary;
    $('#error-message1').addClass('d-none');
    var rule = $("input[name='rule-radio']:checked").val();
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
        default:
            $('#error-message1').removeClass('d-none');
            return
    }

    window.requestAnimationFrame(function() { 
        frame(ruleBinary, 1);
    });
}

var randomFill = function (percent) {
    var newLine = new Array(width);
    var coloredCells = Math.floor(width * percent / 100);
    for (var i = 0; i < coloredCells; i++) {
        var index = Math.floor(Math.random() * width);
        if (newLine[index]) {
            i--;
            continue;
        }
        newLine[index] = 1;
    }
    return newLine;
}

var clearCanvas = function () {
    context.clearRect(0, 0, width, height);
    line = new Array(width);
    line[Math.floor(width/2)] = 1;
    $("input:radio[name='fill-radio']").each(function(i) {
        this.checked = false;
 });
}

var start2 = function () {
    var percentFill = $("input[name='fill-radio']:checked").val();
    if (!percentFill) {
        $('#error-message2').removeClass('d-none');
        return;
    } else {
        $('#error-message2').addClass('d-none');
    }
    drawLine(line, 0);
    window.requestAnimationFrame(function() { 
        frame("10111000", 1);
    });
}

$('input[type=radio][name=fill-radio]').change(function() {
    var percentFill = $("input[name='fill-radio']:checked").val();
    line = randomFill(+percentFill);
});