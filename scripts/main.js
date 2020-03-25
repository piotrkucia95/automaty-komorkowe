const COLOR_WHITE           = [255, 255, 255];
const COLOR_BLACK           = [0, 0, 0];

// indices of colors in colorArray
const WHITE                 = 0;
const BLACK                 = 1;
const SELECTED              = 2;

var stateArray              = [];
var colorArray              = [];

document.ready(() => {
    initializeCanvas();
});

function initializeStateArray (width, height) {
    // order important
    colorArray = [COLOR_WHITE, COLOR_BLACK];
    stateArray = [];
    selectedGrains = [];
    nucleonsNumber = 0;

    for (var i=0; i < width; i++) {
        stateArray[i] = [];
        for (var j=0; j < height; j++) {
            stateArray[i][j] = WHITE;
        }
    }
}