define(['lib/events.js'], function(EventEmitter) {
    function Logger(game)
    {
        var units = [];
        for (var i in game.cohort1.units) {
            var unit = game.cohort1.units[i];
            units.push({
                id: unit.id,
                type: unit.constructor.name,
                x: unit.x,
                y: unit.y,
                direction: unit.direction,
                lives: unit.lives,
                maxLives: unit.maxLives()
            });

            unit._set = this.before(function(property, value) {
                if (units[this.id] == undefined) units[this.id] = {id: this.id};
                units[this.id][property] = value;
            }, unit._set);
        }

        for (var i in game.cohort2.units) {
            var unit = game.cohort2.units[i];
            units.push({
                id: unit.id,
                type: unit.constructor.name,
                x: unit.x,
                y: unit.y,
                direction: unit.direction,
                lives: unit.lives,
                maxLives: unit.maxLives()
            });

            unit._set = this.before(function(property, value) {
                if (units[this.id] == undefined) units[this.id] = {id: this.id};
                units[this.id][property] = value;
            }, unit._set);
        }

        this.init = function()
        {
            if (units.length) {
                this.emit('change', units);
                units = [];
            }
        };

        var self = this;

        this.emitChanges = function()
        {
            var res = [];
            for (var i in units) {
                res.push(units[i]);
            }
            self.emit('change', res);
            units = [];
        };

        game.step = this.after(game.step, this.emitChanges);
    };

    Logger.prototype.emit = EventEmitter.prototype.emit;
    Logger.prototype.on = EventEmitter.prototype.on;
    Logger.prototype.removeAllListeners = EventEmitter.prototype.removeAllListeners;

    Logger.prototype.before = function(beforeFunc, func) {
        return function() {
            beforeFunc.apply(this, arguments);
            return func.apply(this, arguments);
        };
    };

    Logger.prototype.after = function(func, afterFunc) {
        return function() {
            var res = func.apply(this, arguments);
            afterFunc.apply(this, arguments);
            return res;
        };
    };

    return Logger;
});