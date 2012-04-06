define(function() {
    function UnitInterface(unit)
    {
        this.move = function(l) {
            unit.move(l);
        };

        this.attack = function(target)
        {
            unit.attack(target);
        };

        this.canAttack = function(target)
        {
            return unit.canAttack(target);
        };

        this.target = function()
        {
            return unit.target;
        };

        this.self = function()
        {
            return {
                id: unit.id,
                type: unit.constructor.name,
                lives: unit.lives,
                x: unit.x,
                y: unit.y
            };
        };

        this.nearest = function()
        {
            var res = unit.map.nearest(unit, function(_unit) {
                return _unit.lives > 0 && _unit.cohortId != unit.cohortId;
            });
            if (res) {
                return {
                    id: res.id,
                    type: res.constructor.name,
                    lives: res.lives,
                    x: res.x,
                    y: res.y
                };
            } else {
                null;
            }
        };

        this.distance = function(toUnit)
        {
            return unit.map.distance(unit, toUnit);
        };

        this.direction = function(toUnit)
        {
            if (toUnit) {
                return unit.map.direction(unit, toUnit);
            }
        };

        this.turn = function(direction)
        {
            unit.turn(direction);
        };

        this.queueSize = function()
        {
            return unit.actionQueue.length;
        };

        this.resetQueue = function()
        {
            unit.actionQueue = [];
        };

        this.log = function(str)
        {
            console.log(str);
        };
    }

    return UnitInterface;
});