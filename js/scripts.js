function urlQueryParameter(name) {
    // https://stackoverflow.com/a/47566165/4586108
    var results = new RegExp('[\?&]' + name + '=([^&#]*)')
        .exec(window.location.href);
    return results[1] || 0;
}

requirejs.config({
    baseUrl: 'js'
});


requirejs(['./maps', './game'], function (maps, game) {
    var foreground = document.getElementById('pacman-canvas-foreground');
    var background = document.getElementById('pacman-canvas-background');
    // define the map we are going to use in the game.
    var pacmanMap = maps[urlQueryParameter('map')] || maps.OriginalMap;
    var R = pacmanMap.length, C = pacmanMap[0].length;
    // limit canvas dimensions to [1000 x 1000]
    const dimensionH = Math.floor(600 / R);
    const dimensionW = Math.floor(1000 / C);
    // `dimension` must to be multiple of 6 because ghosts moves with speed
    // equal to 2 and PacMan with speed equal to 3.
    var dimension = Math.min(dimensionW, dimensionH);
    while ((dimension * R % 6 !== 0) || (dimension * C % 6 !== 0))
        dimension -= 1;
    // adjust foreground|background canvas dimensions
    $(foreground).attr('height', dimension * R);
    $(background).attr('height', dimension * R);
    $(foreground).attr('width', dimension * C);
    $(background).attr('width', dimension * C);
    // set the height for canvas-container to allow status-holder to
    // display information about the game right bellow the canvas.
    $('.canvas-container').css('height', `${dimension * R}px`);
    // create and start the game.
    var game = new game.Game(3, pacmanMap, foreground, background);
    game.start();
});