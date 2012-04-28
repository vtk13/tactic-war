define(['lib/events.js'], function(EventEmitter) {
    function Logger(game)
    {
        var self = this;
        var units = [];

        function unitChange(event)
        {
            if (units[this.id] == undefined) {
                units[this.id] = {id: this.id, path: []};
            }
            var path = {};
            for (var i in event) {
                if (event.hasOwnProperty(i)) {
                    if (i == 'x') {
                        path.x = units[this.id].x;
                    }
                    if (i == 'y') {
                        path.y = units[this.id].y;
                    }
                    units[this.id][i] = event[i];
                }
            }

            if (path.x || path.y) {
                units[this.id].path.push(path);
            }
        };

        for (var i in game.cohort1.units) {
            var unit = game.cohort1.units[i];
            units.push({
                id: unit.id,
                party: 1,
                type: unit.constructor.name,
                x: unit.x,
                y: unit.y,
                direction: unit.direction,
                health: unit.health,
                maxHealth: unit.maxHealth(),
                path: [] // to track path through step
            });
            unit.on('change', unitChange);
        }

        for (var i in game.cohort2.units) {
            var unit = game.cohort2.units[i];
            units.push({
                id: unit.id,
                party: 2,
                type: unit.constructor.name,
                x: unit.x,
                y: unit.y,
                direction: unit.direction,
                health: unit.health,
                maxHealth: unit.maxHealth()
            });
            unit.on('change', unitChange);
        }

        this.init = function()
        {
            if (units.length) {
                this.emit('change', units);
                units = [];
            }
        };

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