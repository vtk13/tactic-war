var requirejs = require('requirejs');

requirejs(['game-entities/code.js',
        'game-entities/footman.js',
        'game-entities/cohort.js',
        'game-entities/game.js',
        'game-entities/rules/category1.js',
        'game-runner/logger.js',
        'fs'], function(Code, Footman, Cohort, Game, Rules, Logger, fs) {
    var tactic = new Code(fs.readFileSync('test/tactic.js', 'utf8'));
    var rules = new Rules();
    var footman1 = new Footman(tactic, rules);
    var footman2 = new Footman(tactic, rules);
    var cohort1 = new Cohort([footman1], new Code(''));
    var cohort2 = new Cohort([footman2], new Code(''));
    var game = new Game(cohort1, cohort2);

    var logger = new Logger(game);

    logger.on('change', function(data) {
        console.log(data);
    });

    var steps = 40;
    var res;
    while ((res = game.step()) == false) {
        steps--;
        if (steps == 0) {
            break;
        }
    }

});