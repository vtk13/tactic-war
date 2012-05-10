define(function() {
    function UnitInterface(unit)
    {
        this.store = {};

        this.move = function(path)
        {
            unit.move(path);
        };

        this.path = function(to)
        {
            if (to) {
                return unit.map.path(unit, to);
            } else {
                return null;
            }
        };

        this.attack = function(target)
        {
            if (target) {
                return unit.attack(target);
            }
            return false;
        };

        this.canAttack = function(target)
        {
            if (target) {
                return unit.canAttack(target);
            }
            return false;
        };

        this.target = function()
        {
            if (unit.target) {
                var target = unit.map.fetch(unit.target);
                if (target.health <= 0) {
                    unit.target = null;
                    return null;
                } else {
                    return target.proxy;
                }
            }
        };

        this.self = function()
        {
            return unit.proxy;
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
                return res.proxy;
            } else {
                null;
            }
        };

        this.distance = function(to)
        {
            if (typeof to != 'object') {
                throw new Error('Method distance() accepts object, ' + (typeof to) + ' given.');
            } else if (to === null) {
                throw new Error('Method distance() accepts object, null given.');
            } else {
                return unit.map.distance(unit, to);
            }
        };

        this.direction = function(toUnit)
        {
            if (toUnit) {
                return unit.map.direction(unit, toUnit);
            }
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