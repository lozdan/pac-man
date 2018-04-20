const DIRECTIONS = [
    [-1, 0], // up
    [+1, 0], // down
    [0, -1], // left
    [0, +1]  // right
];

const DIRECTIONS_PIXEL = [
    [0, -1], // up
    [0, +1], // down
    [-1, 0], // left
    [+1, 0]  // right
];

function createMatrix(R, C, defaultValue) {
    var result = [];
    for (var i = 0; i < R; i++) {
        var row = [];
        for (var j = 0; j < C; j++)
            row.push(defaultValue);
        result.push(row);
    }
    return result;
}

function BFS(r, c, board, blockedCells) {
    var R = board.length;
    var C = board[0].length;
    var distances = createMatrix(R, C, -1);
    distances[r][c] = 0;
    var queue = [[r, c]];
    while (queue.length > 0) {
        var [r, c] = queue.shift();
        for (var i = 0; i < DIRECTIONS.length; i++) {
            var nextR = (r + DIRECTIONS[i][0] + R) % R;
            var nextC = (c + DIRECTIONS[i][1] + C) % C;
            if (!blockedCells.includes(board[nextR][nextC]) && distances[nextR][nextC] === -1) {
                distances[nextR][nextC] = distances[r][c] + 1;
                queue.push([nextR, nextC]);
            }
        }
    }
    return distances;
}


function drawBackground(canvas, board) {
    var R = board.length, C = board[0].length;
    var cellW = canvas.width / C;
    var cellH = canvas.height / R;
    var ctx = canvas.getContext('2d');
    var lines = [];
    for (var i = 0; i < R; i++)
        for (var j = 0; j < C; j++)
            if (board[i][j] === '#') {
                if (i - 1 === -1 || board[i - 1][j] !== '#')
                    lines.push({
                        x1: j * cellW,
                        y1: i * cellH,
                        x2: (j + 1) * cellW,
                        y2: i * cellH,
                        color: '#0033ff'
                    });

                if (i + 1 === R || board[i + 1][j] !== '#')
                    lines.push({
                        x1: j * cellW,
                        y1: (i + 1) * cellH,
                        x2: (j + 1) * cellW,
                        y2: (i + 1) * cellH,
                        color: '#0033ff'
                    });

                if (j - 1 === -1 || board[i][j - 1] !== '#')
                    lines.push({
                        x1: j * cellW,
                        y1: i * cellH,
                        x2: j * cellW,
                        y2: (i + 1) * cellH,
                        color: '#0033ff'
                    });

                if (j + 1 === C || board[i][j + 1] !== '#')
                    lines.push({
                        x1: (j + 1) * cellW,
                        y1: i * cellH,
                        x2: (j + 1) * cellW,
                        y2: (i + 1) * cellH,
                        color: '#0033ff'
                    });
            } else if (board[i][j] === '-') {
                lines.unshift({
                    x1: j * cellW,
                    y1: (i + 1) * cellH - cellH / 2,
                    x2: (j + 1) * cellW,
                    y2: (i + 1) * cellH - cellH / 2,
                    color: '#ffffff'
                });
            }

    for (let {x1, y1, x2, y2, color} of lines) {
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = color;
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }
}


define('utils', function () {
    return {
        BFS: BFS,
        createMatrix: createMatrix,
        DIRECTIONS: DIRECTIONS,
        DIRECTIONS_PIXEL: DIRECTIONS_PIXEL,
        drawBackground: drawBackground
    };
});
