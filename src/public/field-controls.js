define(['game-entities/helpers/unit-factory.js',
        'game-entities/cohort.js',
        'game-entities/rules/list.js',
        'game-entities/game.js',
        'game-runner/player.js',
        'game-runner/logger.js'], function(unitFactory, Cohort, RulesList, Game, Player, Logger) {

    function FieldControls(tactics, strategies)
    {
        this.cohortStrategySelect = $('select[name=cohort-strategy]');
        this.enemyStrategySelect = $('select[name=enemy-strategy]');
        this.unitTacticSelect = $('select[name=unit-tactic]');
        this.tactics = tactics;
        this.strategies = strategies;
        this.game = null, this.currentUnit = null;
        var self = this;

        var cohortId = $('input[name="cohort_id"]').val();

        var enemySelect = $('select[name=enemy]');

        var buttonRestart = $('button.restart');
        var buttonStep = $('button.step');
        var buttonAll = $('button.all');
        var buttonPause = $('button.pause');
        var rules, logger;
        var player = new Player(logger, $('#field').get(0));
        var steps = 100, interval;

        function createCohortFromJSON(data, neg)
        {
            if (neg != -1) neg = 1;
            var units = [];
            for (var i in data.units) {
                var unit = data.units[i];
                units.push(unitFactory.create(unit.type, neg * unit.id, tactics[unit.tacticId], rules));
            }
            return new Cohort(neg * data.id, units, strategies[data.strategyId]);
        }

        function loadCohorts(cohort1id, cohort2id, cb)
        {
            $.getJSON('/cohort/' + cohort1id + '/load', function(cohort1) {
                rules = RulesList[cohort1.rulesId];
                if (cohort2id == cohort1id) {
                    cb(createCohortFromJSON(cohort1, 1), createCohortFromJSON(cohort1, -1));
                } else {
                    $.getJSON('/cohort/' + cohort2id + '/load', function(cohort2) {
                        cb(createCohortFromJSON(cohort1, 1), createCohortFromJSON(cohort2, -1));
                    });
                }
            });
        }

        function newGame(enemyId) {
            loadCohorts(cohortId, enemyId ? enemyId : cohortId, function(cohort1, cohort2) {
                self.game = new Game(cohort1, cohort2);

                self.cohortStrategySelect.val(cohort1.strategy ? cohort1.strategy.id : 0);
                self.enemyStrategySelect.val(cohort2.strategy ? cohort2.strategy.id : 0);
                self.selectUnit(null);

                if (logger) {
                    logger.removeAllListeners();
                }
                logger = new Logger(self.game);
                player.setSource(logger);
            });
        };

        enemySelect.change(function() {
            newGame(this.value);
        }).change();

        buttonRestart.click(function() {
            clearInterval(interval);
            interval = null;
            steps = 100;
            newGame(enemySelect.val());
        });

        buttonStep.click(function() {
            self.game.step();
        });

        buttonAll.click(function() {
            if (interval) {
                return;
            }
            interval = setInterval(function() {
                var res = self.game.step();
                if (res == false) {
                    steps--;
                    if (steps == 0) {
                        console.log(res);
                        clearInterval(interval);
                        interval = null;
                        steps = 100;
                    }
                } else {
                    console.log(res);
                    clearInterval(interval);
                    interval = null;
                    steps = 100;
                }
            }, 200);
        });

        buttonPause.click(function() {
            clearInterval(interval);
            interval = null;
            steps = 100;
        });

        this.reloadStrategies();
        this.reloadTactics();

        $('#field').click(function(e) {
            var unit = self.game.map.findByXY(
                    e.offsetX / Player.gridSize,
                    e.offsetY / Player.gridSize);
            self.selectUnit(unit);
            logger.emitChanges();
        });
    };

    FieldControls.prototype.selectUnit = function(unit)
    {
        if (this.currentUnit != unit) {
            if (this.currentUnit) {
                this.currentUnit._set('selected', false);
            }
            this.currentUnit = unit;
            if (unit) {
                unit._set('selected', true);
                this.unitTacticSelect.val(unit.tactic ? unit.tactic.id : 0);
            }
        }
    };

    FieldControls.prototype.reloadTactics = function()
    {
        if (!this.unitTacticChange) {
            var self = this;
            this.unitTacticChange = function() {
                var tactic = self.tactics[this.value];
                if (self.currentUnit && self.currentUnit.tactic != tactic) {
                    self.currentUnit.tactic = tactic;
                    // do not save enemy tactic
                    if (self.currentUnit.id > 0) {
                        $.post('/unit/' + self.currentUnit.id + '/edit', {
                            tactic_id: tactic ? tactic.id : 0
                        });
                    }
                }
            }
        }

        this.unitTacticSelect.unbind('change');
        this.unitTacticSelect.empty();
        this.unitTacticSelect.append('<option value="0">none</option>');
        for (var i in this.tactics) {
            this.unitTacticSelect.append('<option value="' + this.tactics[i].id + '">' + this.tactics[i].name + '</option>');
        }
        try {
            this.unitTacticSelect.val(self.currentUnit.tactic.id);
        } catch (ignore) {}
        this.unitTacticSelect.change(this.unitTacticChange);
    };

    FieldControls.prototype.reloadStrategies = function()
    {
        if (!this.cohortStrategyChange) {
            var self = this;
            this.cohortStrategyChange = function() {
                var strategy = self.strategies[this.value];
                if (self.game && self.game.cohort1 && self.game.cohort1.strategy != strategy) {
                    self.game.cohort1.strategy = strategy;
                    $.post('/cohort/' + self.game.cohort1.id + '/edit', {
                        strategy_id: strategy ? strategy.id : 0
                    });
                }
            }
        }

        this.cohortStrategySelect.unbind('change');
        this.cohortStrategySelect.empty();
        this.cohortStrategySelect.append('<option value="0">none</option>');
        for (var i in this.strategies) {
            this.cohortStrategySelect.append('<option value="' + this.strategies[i].id + '">' + this.strategies[i].name + '</option>');
        }
        try {
            this.cohortStrategySelect.val(this.game.cohort1.strategy.id);
        } catch(ignore) {}
        this.cohortStrategySelect.change(this.cohortStrategyChange);


        if (!this.enemyStrategyChange) {
            var self = this;
            this.enemyStrategyChange = function() {
                var strategy = self.strategies[this.value];
                if (self.game && self.game.cohort2 && self.game.cohort2.strategy != strategy) {
                    self.game.cohort2.strategy = strategy;
                    // do not save enemy strategy
                }
            }
        }

        this.enemyStrategySelect.unbind('change');
        this.enemyStrategySelect.empty();
        this.enemyStrategySelect.append('<option value="0">none</option>');
        for (var i in this.strategies) {
            this.enemyStrategySelect.append('<option value="' + this.strategies[i].id + '">' + this.strategies[i].name + '</option>');
        }
        try {
            this.enemyStrategySelect.val(this.game.cohort2.strategy.id);
        } catch(ignore) {}
        this.enemyStrategySelect.change(this.enemyStrategyChange);
    };

    return FieldControls;
});