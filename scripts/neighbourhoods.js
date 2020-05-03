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

function rectangular (x, y, t) {
    for (let i = -1; i <= 1; i++) {
        let pocz = (t % 3 ? 0 : -1);
        let kon = (t % 3 ? 1 : -1);
        for (let j = pocz; j <= kon; j++) {
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

function random3 (x, y, probability) {
    var random = Math.random();
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i == 0 && j == 0) continue;
            if (x + i < 0 || x + i > width -1 || y + j < 0 || y + j > height - 1) continue;
            if (i == 0 && (j == -1 || j == 1)) {
                if (random < probability[0]) {
                    continue;
                }
            } else if ((i == -1 || i == 1) && j == 0) {
                if (random < probability[1]) {
                    continue;
                }
            } else if ((i == -1 && i == -1) || (i == 1 && i == 1)) {
                if (random < probability[2]) {
                    continue;
                }
            } else if ((i == 1 && i == -1) || (i == -1 && i == 1)) {
                if (random < probability[3]) {
                    continue;
                }
            }

            if (matrix[x + i][y + j].oldState) {
                drawPixel(x, y, 0, 0, 0, 255);
                return 1;
            }
        }
    }
    return 0;
}