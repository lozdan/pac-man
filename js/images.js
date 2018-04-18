var dotB = new Image;
var dotM = new Image;
var dotS = new Image;

dotB.src = 'assets/dotb.png';
dotM.src = 'assets/dotm.png';
dotS.src = 'assets/dots.png';

// pacmanImages[dir][frame]
var pacmanImages = {};
[0, 1, 2, 3].forEach(function (dir) {
    pacmanImages[dir] = {};
    for (var frame = 0; frame < 4; frame++) {
        pacmanImages[dir][frame] = new Image;
        pacmanImages[dir][frame].src = `assets/pacman/${dir}/pacman.${frame}.png`;
    }
});

// ghostImages[id][dir][frame]
var ghostImages = {};
[0, 1, 2, 3].forEach(function (id) {
    ghostImages[id] = {};
    [0, 1, 2, 3].forEach(function (dir) {
        ghostImages[id][dir] = {};
        for (var frame = 0; frame < 2; frame++) {
            ghostImages[id][dir][frame] = new Image;
            ghostImages[id][dir][frame].src = `assets/ghost/${id}/${dir}.${frame}.png`;
        }
    });
});

var gDead0 = new Image;
var gDead1 = new Image;
gDead0.src = 'assets/ghost/dead.0.png'
gDead1.src = 'assets/ghost/dead.1.png'

var gAfraid0 = new Image;
var gAfraid1 = new Image;
gAfraid0.src = 'assets/ghost/afraid.0.png'
gAfraid1.src = 'assets/ghost/afraid.1.png'


define('images', function() {
    return {
        dotB: dotB,
        dotM: dotM,
        dotS: dotS,
        gDead0: gDead0,
        gDead1: gDead1,
        gAfraid0: gAfraid0,
        gAfraid1: gAfraid1,
        pacmanImages: pacmanImages,
        ghostImages: ghostImages
    };
});
