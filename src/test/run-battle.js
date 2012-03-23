var requirejs = require('requirejs');

requirejs(['game-entities/code.js',
        'game-entities/footman.js',
        'game-entities/cohort.js',
        'game-entities/game.js',
        'game-entities/rules.js',
        'fs'], function(Code, Footman, Cohort, Game, Rules, fs) {
    var tactic = new Code(fs.readFileSync('test/tactic.js', 'utf8'));
    var rules = new Rules();
    var footman1 = new Footman(tactic, rules);
    var footman2 = new Footman(tactic, rules);
    var cohort1 = new Cohort([footman1], new Code(''));
    var cohort2 = new Cohort([footman2], new Code(''));
    var game = new Game(cohort1, cohort2);

    console.log(footman1.x + ' ' + footman1.y);
    console.log(footman2.x + ' ' + footman2.y);
    var steps = 10;
    var res;
    while ((res = game.step()) == false) {
        steps--;
        if (steps == 0) {
            break;
        }
    }

    console.log(footman1.x + ' ' + footman1.y);
    console.log(footman2.x + ' ' + footman2.y);
});