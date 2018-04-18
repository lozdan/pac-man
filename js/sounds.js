var pacmanChompAudio = new Audio('assets/sounds/pacman_chomp.wav');
var pacmanEatghostAudio = new Audio('assets/sounds/pacman_eatghost.wav');
var pacmanBeginningAudio = new Audio('assets/sounds/pacman_beginning.wav');
var pacmanDeathAudio = new Audio('assets/sounds/pacman_death.wav');

define('sounds', function() {
    return {
        pacmanChompAudio: pacmanChompAudio,
        pacmanEatghostAudio: pacmanEatghostAudio,
        pacmanBeginningAudio: pacmanBeginningAudio,
        pacmanDeathAudio: pacmanDeathAudio
    };
});
