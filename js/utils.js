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

function BFS(x, y, board) {
    var R = board.length;
    var C = board[0].length;
    var distances = createMatrix(R, C, -1);
    distances[x][y] = 0;
    var queue = [[x, y]];
    while (queue.length > 0) {
        var [x, y] = queue.shift();
        for (var i = 0; i < DIRECTIONS.length; i++) {
            var xx = x + DIRECTIONS[i][0];
            var yy = y + DIRECTIONS[i][1];
            if (0 <= xx && xx < R && 0 <= yy && yy < C && board[xx][yy] !== '#' && distances[xx][yy] === -1) {
                distances[xx][yy] = distances[x][y] + 1;
                queue.push([xx, yy]);
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
    for (var i = 0; i < R; i++)
        for (var j = 0; j < C; j++)
            if (board[i][j] === '#') {
                var lines = [];

                if (i - 1 === -1 || board[i - 1][j] !== '#')
                    lines.push([j * cellW, i * cellH, (j + 1) * cellW, i * cellH]);

                if (i + 1 === R || board[i + 1][j] !== '#')
                    lines.push([j * cellW, (i + 1) * cellH, (j + 1) * cellW, (i + 1) * cellH]);

                if (j - 1 === -1 ||  board[i][j - 1] !== '#')
                    lines.push([j * cellW, i * cellH, j * cellW, (i + 1) * cellH]);

                if (j + 1 === C || board[i][j + 1] !== '#')
                    lines.push([(j + 1) * cellW, i * cellH, (j + 1) * cellW, (i + 1) * cellH]);

                for (let [x1, y1, x2, y2] of lines) {
                    ctx.beginPath();
                    ctx.lineWidth = 2;
                    ctx.strokeStyle = '#0033ff';
                    ctx.moveTo(x1, y1);
                    ctx.lineTo(x2, y2);
                    ctx.stroke();
                }
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
