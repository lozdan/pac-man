const DIRECTIONS = [
    [-1, 0],
    [+1, 0],
    [0, -1],
    [0, +1]
];


function Ghost(x, y) {
    this.x = x;
    this.y = y;
    this.direction = Math.floor(Math.random() * 4);
    // 0 -> normal
    // 1 -> returning to the base
    this.status = 'normal';
    this.name = "ghost";
    this.draw = function (ctx, cellW, cellH) {
        ctx.fillStyle = 'blue';
        var x = this.y * cellW;
        var y = this.x * cellH;
        ctx.fillRect(x, y, cellW, cellH);
    };
}

function Pacman(x, y) {
    this.x = x;
    this.y = y;
    // start moving to the left
    this.direction = 0;
    this.nextDirection = 0;
    // 0 -> normal
    // 1 -> super
    // 2 -> dead
    this.status = 'normal';
    this.name = "pacman";
    this.draw = function (ctx, cellW, cellH) {
        ctx.fillStyle = 'yellow';
        var x = this.y * cellW;
        var y = this.x * cellH;
        ctx.fillRect(x, y, cellW, cellH);
    };
}

function Game(lifes, board) {
    var self = this;
    this.score = 0;
    this.lifes = lifes;
    this.board = board;
    this.pacman;
    this.ghosts = [];

    this.R = board.length;
    this.C = board[0].length;

    for (var i = 0; i < this.R; i++)
        for (var j = 0; j < this.C; j++) {
            if (board[i][j] === 'p')
                this.pacman = new Pacman(i, j);
            if (board[i][j] === 'g')
                this.ghosts.push(new Ghost(i, j));
        }

    document.onkeydown = function (event) {
        if (event.which === 65){
            self.pacman.nextDirection = 2;}
        else if (event.which === 87)
            self.pacman.nextDirection = 0;
        else if (event.which === 68)
            self.pacman.nextDirection = 3;
        else if (event.which === 83)
            self.pacman.nextDirection = 1;
    };


    // store PacMan's original coordinates
    this.pacmanX = this.pacman.x;
    this.pacmanY = this.pacman.y;

    this.canMove = function (character, direction) {
        var x = character.x + DIRECTIONS[direction][0];
        var y = character.y + DIRECTIONS[direction][1];
        if (0 <= x && x < this.R && 0 <= y && y < this.C && board[x][y] !== '#')
            return true;

        return false;
    };

    this.move = function(character) {
        if (character.name === "ghost"){
            character.direction = Math.floor(Math.random() * 4);
        }

        if (character.name === "pacman" && this.canMove(character, character.nextDirection))
            character.direction = character.nextDirection;

        if (this.canMove(character, character.direction)){
            character.x += DIRECTIONS[character.direction][0];
            character.y += DIRECTIONS[character.direction][1];
        }
        console.log(character.name + " " + character.x + " " + character.y);
    };

    this.moveAll = function() {
        this.ghosts.forEach(function(ghost) {
            self.move(ghost);
            if (ghost.x === self.pacman.x && ghost.y === self.pacman.y) {
                if (ghost.status === 'normal') {
                    if (self.pacman.status === 'normal') {
                        self.pacman.status = 'dead';
                    } else if (self.pacman.status === 'super') {
                        ghost.status = 'base';
                    }
                }
            }
        });

        if (this.pacman.status !== 'dead') {
            this.move(this.pacman);
        }
    };

    this.updateGame = function() {
        this.moveAll();

        if (this.pacman.status === 'dead') {
            this.lifes -= 1;
            if (this.lifes >= 0) {
                this.pacman = new Pacman(this.pacmanX, this.pacmanY);
                // TODO: Restart the Game
            } else {
                // TODO: Report GameOver
            }
        }
    };

    this.draw = function(canvas) {
        var ctx = canvas.getContext('2d');

        var W = canvas.width;
        var H = canvas.height;

        ctx.clearRect(0, 0, W, H);

        var cellW = W / this.C;
        var cellH = H / this.R;

        for (var i = 0; i < this.R; i++)
            for (var j = 0; j < this.C; j++) {
                if (this.board[i][j] === '#') {
                    ctx.fillStyle = 'black';
                    var x = j * cellW;
                    var y = i * cellH;
                    ctx.fillRect(x, y, cellW, cellH);
                }
                else if (this.board[i][j] === '.') {
                    ctx.fillStyle = '#ff0000';
                    var x = j * cellW;
                    var y = i * cellH;
                    var margin = 2;
                    ctx.fillRect(x+margin, y+margin, cellW-2*margin, cellH-2*margin);
                } else if (this.board[i][j] === '*') {
                    ctx.fillStyle = '#00ff00';
                    var x = j * cellW;
                    var y = i * cellH;
                    var margin = 2;
                    ctx.fillRect(x+margin, y+margin, cellW-2*margin, cellH-2*margin);
                }
            }

        this.pacman.draw(ctx, cellW, cellH);
        this.ghosts.forEach(function (ghost) {
            ghost.draw(ctx, cellW, cellH);
        });
    };
}


//
// # -> block
// . -> small dot
// * -> big dot
//   -> blank
// p -> pacman
// g -> ghost
// f -> fruit
//
MAP = [
    '############################',
    '#............##............#',
    '#.####.#####.##.#####.####.#',
    '#*####.#####.##.#####.####*#',
    '#.####.#####.##.#####.####.#',
    '#..........................#',
    '#.####.##.########.##.####.#',
    '#.####.##.########.##.####.#',
    '#......##....##....##......#',
    '######.#####.##.#####.######',
    '######.#####.##.#####.######',
    '######.##    g     ##.######',
    '######.## ###  ### ##.######',
    '######.## ###  ### ##.######',
    '      .   ##g gg##   .      ',
    '######.## ######## ##.######',
    '######.## ######## ##.######',
    '######.##          ##.######',
    '######.## ######## ##.######',
    '######.## ######## ##.######',
    '#............##............#',
    '#.####.#####.##.#####.####.#',
    '#.####.#####.##.#####.####.#',
    '#*..##........p.......##..*#',
    '###.##.##.########.##.##.###',
    '###.##.##.########.##.##.###',
    '#......##....##....##......#',
    '#.##########.##.##########.#',
    '#.##########.##.##########.#',
    '#..........................#',
    '############################'
];

//alert(MAP.length + ' ' + MAP[0].length);

var game = new Game(3, MAP);

var canvas = document.getElementById('myCanvas');

setInterval(function () {
    game.draw(canvas);
    game.moveAll()
}, 150);

