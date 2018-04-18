function Ghost(x, y, width, height, id) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.id = id;
    this.originalX = x;
    this.originalY = y;
    this.name = "ghost";
    this.direction = Math.floor(Math.random() * 4);
    // dead | scatter | chase | afraid
    this.status = 'scatter';
    this.statusSince;
    this.draw = function (ctx, game) {
        var ticks = Math.floor(game.animationTicks / 10);
        var image;
        if (this.status === 'afraid') {
            if (ticks % 2 === 0)
                image = gAfraid0;
            else image = gAfraid1;
        } else if (this.status === 'dead') {
            if (this.y > game.pacman.y)
                image = gDead0;
            else image = gDead1;
        } else {
            image = ghostImages[this.id % 4][this.direction][ticks % 2];
        }
        ctx.drawImage(image, this.x, this.y, this.width, this.height);
    }
    this.isDangerous = function () {
        return this.status === 'scatter' || this.status === 'chase';
    }
    this.isPassive = function () {
        return this.status === 'dead' || this.status === 'afraid';
    }
    this.restart = function () {
        this.x = this.originalX;
        this.y = this.originalY;
        this.setStatus('scatter');
    }

    this.getStatusSince = function () {
        if (!this.statusSince)
            this.statusSince = Date.now();
        return this.statusSince;
    }

    this.setStatus = function (status) {
        if (status !== this.status || status === 'afraid') {
            this.status = status;
            this.statusSince = Date.now();
        }
    }
};

function Pacman(x, y, width, height) {
    this.x = x;
    this.y = y;

    this.originalX = x;
    this.originalY = y;

    this.width = width;
    this.height = height;

    this.name = "pacman";

    this.direction = 2;
    this.nextDirection = 2;

    this.draw = function (ctx, game) {
        var ticks = Math.floor(game.animationTicks / 5);
        var image = pacmanImages[this.direction][ticks % 4];
        ctx.drawImage(image, this.x, this.y, this.width, this.height);
    }

    this.restart = function () {
        this.x = this.originalX;
        this.y = this.originalY;
        this.direction = 2;
        this.nextDirection = 2;
    }
};

define('characters', function () {
    return {
        Pacman: Pacman, Ghost: Ghost
    };
});