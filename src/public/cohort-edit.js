
requirejs(['game-entities/code.js',
    'game-entities/helpers/unit-factory.js',
    'game-entities/cohort.js',
    'game-entities/game.js',
    'game-entities/rules/list.js',
    'game-runner/logger.js',
    'game-runner/player.js',
    'public/editor.js'], function(Code, unitFactory, Cohort, Game, RulesList, Logger, Player, Editor) {
    $.getJSON('/cohort/' + $('input[name="cohort_id"]').val() + '/load', function(cohort) {
        $.getJSON('/code/load', function(code) {
            var codeSelect = $('select[name=tactic]');
            var nameInput = $('input[name=name]');

            var tactics = [];
            for (var i in code.tactic) {
                tactics[code.tactic[i].id] = new Code(code.tactic[i].id,
                    code.tactic[i].name,
                    code.tactic[i].src);
            }

            var strategies = [];
            for (var i in code.strategy) {
                strategies[code.strategy[i].id] = new Code(code.strategy[i].id,
                    code.strategy[i].name,
                    code.strategy[i].src);
            };

            var rules = RulesList[cohort.rulesId];

            var units1 = [];
            for (var i in cohort.units) {
                var unit = cohort.units[i];
                units1.push(unitFactory.create(unit.type, unit.id, tactics[unit.tacticId], rules));
            }

            var cohort1 = new Cohort(cohort.id, units1, strategies[cohort.strategyId]);

            var units2 = [];
            var code = new Code(0, '',
"resetQueue();\n\
_target = nearest();\n\
if (canAttack(_target)) {\n\
    attack(_target);\n\
} else {\n\
    turn(direction(_target));\n\
    move(distance(_target));\n\
}");
            for (var i in cohort.units) {
                var unit = cohort.units[i];
                units2.push(unitFactory.create(unit.type, -unit.id, code, rules));
            }
            var cohort2 = new Cohort(-cohort.id, units2, new Code(0, '', ''));

            var game = new Game(cohort1, cohort2);
            var logger = new Logger(game);

            var player = new Player(logger, $('#field').get(0));
            logger.init();

            var editor = new Editor($('select[name=tactic]'), $('input[name=name]'), $('#code-src'),
                $('button#save'), cohort1, tactics, strategies);

            $('button.step').add('button.all').add('button.pause').click(function() {
                editor.push();
            });

            $('#field').click(function(e) {
                var unit = game.map.findByXY(e.offsetX, e.offsetY);
                if (cohort1.contain(unit)) {
                    editor.setUnit(unit);
                    logger.emitChanges();
                }
            });

            var steps = 100, interval;

            $('button.step').click(function() {
                game.step();
            });

            $('button.all').click(function() {
                if (interval) {
                    return;
                }
                interval = setInterval(function() {
                    var res = game.step();
                    if (res == false) {
                        steps--;
                        if (steps == 0) {
                            console.log(res);
                            clearInterval(interval);
                            interval = null;
                        }
                    } else {
                        console.log(res);
                        clearInterval(interval);
                        interval = null;
                    }
                }, 200);
            });

            $('button.pause').click(function() {
                clearInterval(interval);
                interval = null;
            });
        });
    });
});
