define('game', ['./images', './sounds', './utils', './characters'], function () {
    function Game(lives, board, foregroundCanvas, backgroundCanvas) {
        var self = this;

        this.score = 0;
        this.lives = lives;
        this.board = board;
        this.pacman;
        this.ghosts = [];
        this.score = 0;
        this.pacmanDistances;
        this.scoreByEatingGhost = 200;

        this.R = board.length;
        this.C = board[0].length;

        this.animationTicks = 0;

        // store all related with the canvas
        this.canvas = foregroundCanvas;
        this.cellW = foregroundCanvas.width / this.C;
        this.cellH = foregroundCanvas.height / this.R;
        this.context = foregroundCanvas.getContext('2d');

        this.getRow = function (character) {
            if (character.name === 'pacman') {
                var result = Math.round(character.y / this.cellH);
            }
            return Math.round(character.y / this.cellH);
        };

        this.getCol = function (character) {
            if (character.name === 'pacman') {
                var result = Math.round(character.x / this.cellW);
            }
            return Math.round(character.x / this.cellW);
        };

        // running | over
        this.status = 'running';

        // add lives to the DOM
        for (var i = 0; i < lives; i++)
            $('#lives').append('<img src="assets/hearth.png">');

        this.board = board.map(function (row) {
            return row.split('');
        });

        for (var i = 0; i < this.R; i++)
            for (var j = 0; j < this.C; j++) {
                var x = j * this.cellW;
                var y = i * this.cellH;
                if (board[i][j] === 'p') {
                    this.pacman = new Pacman(x, y, this.cellW, this.cellH);
                }

                if ('0123456789'.indexOf(board[i][j]) !== -1)
                    this.ghosts.push(new Ghost(x, y, this.cellW, this.cellH, board[i][j] % 4));
            }

        document.onkeydown = function (event) {
            // 37 -> left
            // 38 -> up
            // 39 -> right
            // 40 -> down
            if (event.which === 37)
                self.pacman.nextDirection = 2;
            else if (event.which == 38)
                self.pacman.nextDirection = 0;
            else if (event.which == 39)
                self.pacman.nextDirection = 3;
            else if (event.which == 40)
                self.pacman.nextDirection = 1;
        };


        this.canMove = function (character, direction) {
            if (character.x % this.cellW === 0 && character.y % this.cellH === 0) {
                var r = this.getRow(character) + DIRECTIONS[direction][0];
                var c = this.getCol(character) + DIRECTIONS[direction][1];
                if (0 <= r && r < this.R && 0 <= c && c < this.C && board[r][c] !== '#')
                    return true;
                return false;
            }
            return (character.direction === direction);
        };

        this.move = function (character) {
            if (character.name === 'ghost') {
                var altDirections = [];

                if (character.status === 'scatter') {
                    if (this.canMove(character, character.direction))
                        altDirections.push(character.direction);
                    if (character.direction === 0 || character.direction === 1) {
                        if (this.canMove(character, 2)) altDirections.push(2);
                        if (this.canMove(character, 3)) altDirections.push(3);
                    } else {
                        if (this.canMove(character, 0)) altDirections.push(0);
                        if (this.canMove(character, 1)) altDirections.push(1);
                    }
                    if (altDirections.length === 0)
                        altDirections.push(character.direction ^ 1);
                }

                if (character.status === 'chase') {
                    var bestDistance = -1;
                    for (var i = 0; i < DIRECTIONS.length; i++)
                        if (this.canMove(character, i)) {
                            var r = this.getRow(character) + DIRECTIONS[i][0];
                            var c = this.getCol(character) + DIRECTIONS[i][1];
                            if (bestDistance === -1 || bestDistance > this.pacmanDistances[r][c]) {
                                bestDistance = this.pacmanDistances[r][c];
                                altDirections = [i];
                            } else if (bestDistance === this.pacmanDistances[r][c])
                                altDirections.push(i);
                        }
                }

                if (character.status === 'afraid') {
                    var bestDistance = -1;
                    for (var i = 0; i < DIRECTIONS.length; i++)
                        if ((i ^ 1) != character.direction && this.canMove(character, i)) {
                            var r = this.getRow(character) + DIRECTIONS[i][0];
                            var c = this.getCol(character) + DIRECTIONS[i][1];
                            if (bestDistance === -1 || bestDistance < this.pacmanDistances[r][c]) {
                                bestDistance = this.pacmanDistances[r][c];
                                altDirections = [i];
                            } else if (bestDistance === this.pacmanDistances[r][c]) {
                                altDirections.push(i);
                            }
                        }
                    if (altDirections.length === 0)
                        altDirections.push(character.direction ^ 1);
                }

                if (character.status === 'dead') {
                    altDirections = [character.direction];
                }

                if (altDirections.length > 0)
                    character.direction = altDirections[Math.floor(Math.random() * altDirections.length)];
            }

            if (character.name === 'pacman' && this.canMove(character, character.nextDirection))
                character.direction = character.nextDirection;

            if (this.canMove(character, character.direction)) {
                var speed = 2;
                if (character.name === 'pacman')
                    speed = 3;
                character.x += speed * DIRECTIONS_PIXEL[character.direction][0];
                character.y += speed * DIRECTIONS_PIXEL[character.direction][1];
            }
        };

        this.collide = function (character1, character2) {
            var x1 = Math.max(character1.x, character2.x);
            var x2 = Math.min(character1.x + character1.width, character2.x + character2.width);
            var y1 = Math.max(character1.y, character2.y);
            var y2 = Math.min(character1.y + character1.height, character2.y + character2.height);
            var dx = Math.max(0, x2 - x1);
            var dy = Math.max(0, y2 - y1);
            return dx * dy > 0.5 * (character1.width * character1.height);
        };

        this.moveAll = function () {
            this.pacmanDistances = BFS(
                this.getRow(this.pacman),
                this.getCol(this.pacman),
                this.board
            );

            this.ghosts.forEach(function (ghost) {
                self.move(ghost);
                if (self.collide(ghost, self.pacman)) {
                    if (ghost.isDangerous()) {
                        self.status = 'over';
                    } else if (ghost.status === 'afraid') {
                        ghost.setStatus('dead');
                        self.score += self.scoreByEatingGhost;
                        /*
                        self.context.font = "16px Bangers";
                        self.context.fillStyle = "white";
                        self.context.textAlign = "center";
                        self.context.fillText(self.scoreByEatingGhost,
                            ghost.x, ghost.y);
                        */
                        self.scoreByEatingGhost *= 2;
                        pacmanEatghostAudio.play();
                    }
                }
            });

            if (this.status === 'running') {
                this.move(this.pacman);
                var r = this.getRow(this.pacman);
                var c = this.getCol(this.pacman);
                var u = this.board[r][c];
                if (u === '.' || u === '*') {
                    if (u === '.') {
                        this.score += 10;
                        pacmanChompAudio.play();
                    } else if (u === '*') {
                        this.score += 50;
                        self.scoreByEatingGhost = 200;
                        this.ghosts.forEach(function (ghost) {
                            ghost.setStatus('afraid');
                            ghost.direction ^= 1;
                        });
                    }
                    this.board[r][c] = ' ';
                }
            }

            //undefine.x = 1;

            $('#score').html(this.score);
        };

        drawBackground(backgroundCanvas, board);

        this.draw = function () {
            this.animationTicks += 1;

            var ctx = this.context;

            //console.log(ctx);

            // change ghosts status
            if (this.status === 'running') {
                var now = Date.now();
                this.ghosts.forEach(function (ghost) {
                    var statusSince = ghost.getStatusSince();
                    if (ghost.status === 'scatter' && now - statusSince > 5000)
                        ghost.setStatus('chase');
                    else if (ghost.status === 'chase' && now - statusSince > 10000)
                        ghost.setStatus('scatter');
                    else if (ghost.status === 'afraid' && now - statusSince > 7000)
                        ghost.setStatus('scatter');
                });

                if (this.status === 'running')
                    this.moveAll();
            }

            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            var dots = 0;
            for (var i = 0; i < this.R; i++)
                for (var j = 0; j < this.C; j++) {
                    if (this.board[i][j] === '.') {
                        ctx.fillStyle = '#ff0000';
                        var x = j * this.cellW;
                        var y = i * this.cellH;
                        var margin = 2;
                        ctx.drawImage(dotS, x, y, this.cellW, this.cellH);
                        dots += 1;
                    } else if (this.board[i][j] === '*') {
                        ctx.fillStyle = '#00ff00';
                        var x = j * this.cellW;
                        var y = i * this.cellH;
                        var margin = 2;
                        var frame = Math.floor(this.animationTicks / 10);
                        if (frame % 4 === 0) {
                            ctx.drawImage(dotS, x, y, this.cellW, this.cellH);
                        } else if (frame % 4 == 1) {
                            ctx.drawImage(dotM, x, y, this.cellW, this.cellH);
                        } else if (frame % 4 == 2) {
                            ctx.drawImage(dotB, x, y, this.cellW, this.cellH);
                        } else if (frame % 4 == 3) {
                            ctx.drawImage(dotM, x, y, this.cellW, this.cellH);
                        }
                        dots += 1;
                    }
                }

            this.ghosts.forEach(function (ghost) {
                ghost.draw(ctx, self);
            });
            this.pacman.draw(ctx, self);

            if (dots === 0) {
                var person = prompt("You Win, enter your name", "");
                document.location.reload();
            }

            if (this.status === 'over') {
                self.over();
            }

            if (this.status === 'starting') {
                this.context.font = "32px Bangers";
                this.context.fillStyle = "white";
                this.context.textAlign = "center";
                this.context.fillText("Get ready!",
                    this.canvas.width / 2, this.canvas.height / 2 + 20);
            }

            requestAnimationFrame(function () {
                self.draw();
            });
        };

        this.over = function () {
            self.status = "playing-death-audio";

            pacmanDeathAudio.play();
            pacmanDeathAudio.onended = function () {
                self.lives -= 1;
                $($('#lives img')[0]).remove();
                if (self.lives > 0) {
                    self.status = 'starting';
                    self.pacman.restart();
                    self.ghosts.forEach(function (ghost) {
                        ghost.restart();
                    });
                    setTimeout(function () {
                        self.status = 'running';
                    }, 2000);
                } else {
                    var name = prompt(`Enter your name - Score = ${self.score}`);
                    if (name) {
                        $.post('https://isureit.com/api/bd/', {
                            token: 'e472b4b5-f572-4ceb-87c2-8bd313e69ac5',
                            value: JSON.stringify({ name: name, score: self.score, won: false })
                        }, function () {
                            window.location.reload();
                        });
                    }
                }
            };
        };

        this.start = function () {
            this.status = 'starting';
            this.draw();
            pacmanBeginningAudio.play();
            pacmanBeginningAudio.onended = function () {
                self.status = 'running';
            };
        };
    };

    return {
        Game: Game
    }
});
