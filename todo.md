implement an init() and reset game


function init() {
    // terrainPattern = ctx.createPattern(resources.get('img/terrain.png'), 'repeat');

    document.getElementById('play-again').addEventListener('click', function() {
        reset();
    });

    reset();
    lastTime = Date.now();
    main();
}


// implement a check for image load then run init
// resources.load([
//     'img/sprites.png',
//     'img/terrain.png'
// ]);
// resources.onReady(init);

I don't know if I need update Direction - I might wanna just make it update directionVector and always deal with dirs (NESW)
