define(['game-entities/managers/publish-manager.js',
        'game-entities/rules/list.js',
        'game-entities/helpers/unit-factory.js',
        'game-entities/game.js',
        'game-runner/logger.js',
        'game-entities/cohort.js',
        'game-entities/code.js'], function(publishManager, rulesList, unitFactory,
               Game, Logger, Cohort, Code) {

    function Battle(publish1, publish2)
    {
        this.publish1 = publish1;
        this.publish2 = publish2;
    };

    Battle.prototype._loadPublishes = function(cb)
    {
        var self = this;
        publishManager.load(self.publish1, function(error, publish1) {
            publishManager.load(self.publish2, function(error, publish2) {
                cb(publish1, publish2);
            });
        });
    };

    Battle.prototype.createCohort = function(data)
    {
        var rules = rulesList[data.rulesId];
        var tactics = [], code, i;
        for (i in data.tactics) {
            code = new Code(data.tactics[i].id, data.tactics[i].name, data.tactics[i].src);
            tactics[code.id] = code;
        }
        var units = [], unit;
        for (i in data.units) {
            unit = unitFactory.create(data.units[i].type, data.units[i].id,
                tactics[data.units[i].tacticId], rules);
            units.push(unit);
        }
        var strategy = null;
        if (data.strategy) {
            strategy = new Code(data.strategy.code_id, data.strategy.code_name, data.strategy.code_src);
        }
        return new Cohort(data.id, units, strategy, tactics);
    };

    Battle.prototype.process = function(cb)
    {
        var self = this;
        this._loadPublishes(function(publish1, publish2) {
            var rules = rulesList[publish1.rulesId];
            if (self.publish2 == 0) {
                publish2.rulesId = publish1.rulesId;
            }
            var cohort1 = self.createCohort(publish1);
            var cohort2 = self.createCohort(publish2);
            var game = new Game(cohort1, cohort2);
            var logger = new Logger(game);

            var gameLog = [];

            logger.on('change', function(data) {
                gameLog.push(data);
            });
            logger.init();

            var steps = rules.maxSteps();

            function step()
            {
                var res = game.step();
                steps--;
                if (res || steps == 0) {
                    var message;
                    if (res == false ) {
                        message = {
                            winner: {id: 0}
                        };
                    } else {
                        message = {
                            winner: {id: res.winner.id}
                        };
                    }
                    message.gameLog = gameLog;
                    process.nextTick(function() {
                        cb(message);
                    });
                } else {
                    process.nextTick(step);
                }
            }

            step();
        });
    };

    return Battle;
});