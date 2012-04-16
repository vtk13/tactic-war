define(function() {
    function UnitInterface(unit)
    {
        this.store = {};

        this.move = function(distance)
        {
            if (distance > 0) {
                unit.move(distance);
            }
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
            if (unit.target && unit.target.health <= 0) {
                unit.target = null;
            }
            return unit.target;
        };

        this.self = function()
        {
            return {
                id: unit.id,
                type: unit.constructor.name,
                health: unit.health,
                x: unit.x,
                y: unit.y
            };
        };

        this.command = function()
        {
            var res = unit.command;
            delete unit.command;
            return res;
        }

        this.nearest = function()
        {
            var res = unit.map.nearest(unit, function(_unit) {
                return _unit.health > 0 && _unit.cohortId != unit.cohortId;
            });
            if (res) {
                return {
                    id: res.id,
                    type: res.constructor.name,
                    health: res.health,
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

        if (typeof window == 'undefined') {
            this.log = function(str) {};
        } else {
            this.log = function(str)
            {
                console.log.apply(console, arguments);
            };
        }
    }

    return UnitInterface;
});