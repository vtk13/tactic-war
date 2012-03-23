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

        this.nearest = function()
        {
            var res = unit.map.nearest(unit);
            return {
                id: res.id,
                x: res.x,
                y: res.y
            };
        };

        this.distance = function(toUnit)
        {
            return unit.map.distance(unit, toUnit);
        };

        this.direction = function(toUnit)
        {
            return unit.map.direction(unit, toUnit);
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