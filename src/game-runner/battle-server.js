var requirejs = require('requirejs');

process.on('message', function(data) {
    requirejs(['game-runner/battle.js'], function(Battle) {
        var battle = new Battle(data.p1, data.p2);
        battle.process(function(result) {
            process.send(result);
        });
    });
});