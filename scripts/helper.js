var isCanvasDrawable = false;

$('input[name="optradio"]').on('click', (event) => {
    if(event.target.value === 'manual') {
        $('#grains-number').attr('disabled', true);
        $('#grains-button').attr('disabled', true);
        isCanvasDrawable = true;
    } else {
        $('#grains-number').prop('disabled', false);
        $('#grains-button').prop('disabled', false);
        isCanvasDrawable = false;
    }
});

$('#main-canvas').on('click', (event) => {
    if (isCanvasDrawable) {
        var size = +$('#grains-size').val();
        var shape = +$('#grains-shape').val();
        if (!size || size < 1) {
            $('#size-error').text('Wprowadź rozmiar pojedynczego zarodka.');
            return;
        } else {
            addNucleon(event.offsetX, event.offsetY, size, shape);
            updateCanvas();
            $('#size-error').text('');
        }
    }
});

function spreadNucleonsRandomly () {
    var amount = +$('#grains-number').val();
    var size = +$('#grains-size').val();
    var shape = +$('#grains-shape').val();
    var isError = false;
    if (!amount || amount < 1) {
        $('#grains-error').text('Wprowadź ilość ziarn.');
        isError = true;
    } 
    if (!size || size < 1) {
        $('#size-error').text('Wprowadź rozmiar pojedynczego zarodka.');
        isError = true;
    }
    if (!isError) {
        for (var i=0; i < amount; i++) {
            var randomXIndex = Math.floor(Math.random() * width);
            var randomYIndex = Math.floor(Math.random() * height);
            if (matrix[randomXIndex][randomYIndex].state != 0) {
                i--;
                continue;
            }
            addNucleon(randomXIndex, randomYIndex, size, shape);
        }
        updateCanvas();
        $('#grains-error').text('');
        $('#size-error').text('');
    }
}

var disableInputs = function() {
    isCanvasDrawable = false;
    $('input[name="optradio"]').attr('disabled', true);
    $('#grains-size').attr('disabled', true);
    $('#grains-shape').attr('disabled', true);
    $('#grains-number').attr('disabled', true);
    $('#grains-button').attr('disabled', true);
}

var enableInputs = function() {
    $('input[name="optradio"]').prop('disabled', false);
    $('input[name="optradio"]').prop('checked', false);
    $('#grains-size').prop('disabled', false);
    $('#grains-size').val('');
    $('#grains-shape').prop('disabled', false);
    $('#grains-shape').val('0');
    $('#grains-size').val('');
    $('#grains-number').val('');
}

function getRandomColor() {
    var red = Math.floor(Math.random() * 256);
    var green = Math.floor(Math.random() * 256);
    var blue = Math.floor(Math.random() * 256);

    return [red, green, blue];
}