
requirejs(['game-entities/code.js',
    'game-entities/helpers/unit-factory.js',
    'game-entities/cohort.js',
    'game-entities/game.js',
    'game-entities/rules/list.js',
    'game-runner/logger.js',
    'game-runner/player.js',
    'public/editor.js',
    'public/sandbox-enemy.js'], function(Code, unitFactory, Cohort, Game, RulesList, Logger, Player, Editor,
                                         sandboxEnemy) {

    var cohortId = $('input[name="cohort_id"]').val();
    var tactics = [];
    var strategies = [];
    var rules;

    function createCohortFromJSON(data, neg)
    {
        if (neg != -1) neg = 1;
        var units = [];
        for (var i in data.units) {
            var unit = data.units[i];
            units.push(unitFactory.create(unit.type, neg * unit.id, tactics[unit.tacticId], rules));
        }
        return new Cohort(neg * data.id, units, strategies[data.strategyId]);
    };

    function loadCohorts(cohort1id, cohort2id, cb)
    {
        $.getJSON('/cohort/' + cohort1id + '/load', function(cohort1) {
            rules = RulesList[cohort1.rulesId];
            if (cohort2id == cohort1id) {
                cb(createCohortFromJSON(cohort1), createCohortFromJSON(cohort1, -1));
            } else {
                $.getJSON('/cohort/' + cohort2id + '/load', function(cohort2) {
                    cb(createCohortFromJSON(cohort1), createCohortFromJSON(cohort2, -1));
                });
            }
        });
    };

    $.getJSON('/code/load', function(code) {
        var codeSelect = $('select[name=tactic]');
        var enemySelect = $('select[name=enemy]');
        var nameInput = $('input[name=name]');

        for (var i in code.tactic) {
            tactics[code.tactic[i].id] = new Code(code.tactic[i].id,
                code.tactic[i].name,
                code.tactic[i].src);
        }

        for (var i in code.strategy) {
            strategies[code.strategy[i].id] = new Code(code.strategy[i].id,
                code.strategy[i].name,
                code.strategy[i].src);
        };

        var game, logger;

        var player = new Player(logger, $('#field').get(0));

        var editor = new Editor($('select[name=tactic]'), $('input[name=name]'), $('#code-src'),
            $('button#save'), tactics, strategies);

        function newGame(enemyId)
        {
            editor.setUnit(null);
            editor.setCode(null);
            loadCohorts(cohortId, enemyId ? enemyId : cohortId, function(cohort1, cohort2) {
                game = new Game(cohort1, cohort2);
                if (logger) {
                    logger.removeAllListeners();
                }
                logger = new Logger(game);
                player.setSource(logger);
            });
        }

        new sandboxEnemy(enemySelect, newGame);

        $('button.step').add('button.restart').add('button.all').add('button.pause').click(function() {
            editor.push();
        });

        $('button.restart').click(function() {
            newGame($('select[name=enemy]').val());
        });

        $('#field').click(function(e) {
            var unit = game.map.findByXY(e.offsetX, e.offsetY);
            editor.setUnit(unit);
            logger.emitChanges();
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
