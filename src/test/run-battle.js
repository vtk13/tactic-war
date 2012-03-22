var requirejs = require('requirejs');

requirejs(['game-entities/code.js',
        'game-entities/footman.js',
        'game-entities/cohort.js',
        'game-entities/game.js'], function(Code, Footman, Cohort, Game) {
    var tactic = new Code('log(nearest());');
    var cohort1 = new Cohort([new Footman(tactic)], new Code('test(123)'));
    var cohort2 = new Cohort([new Footman(tactic)], new Code('test(123)'));
    var game = new Game(cohort1, cohort2);
    game.step();
});