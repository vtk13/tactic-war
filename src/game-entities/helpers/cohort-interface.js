define(function() {
    function CohortInterface(cohort)
    {
        this.store = {};

        this.enemies = function() {
            return cohort.enemies.alives(true);
        };

        this.confederates = function() {
            return cohort.alives(true);
        };

        this.middle = function(units)
        {
            var x = 0, y = 0;
            for (var i in units) {
                x += units[i].x();
                y += units[i].y();
            }
            return {
                x: x / units.length,
                y: y / units.length
            };
        };

        this.nearest = function(from)
        {
            var res = [];
            var nearests = cohort.map.nearests(from, function(_unit) {
                return _unit.health > 0 && _unit.cohortId != cohort.id;
            });
            for (var i in nearests) {
                res.push({
                    unit: nearests[i].unit.proxy,
                    distance: nearests[i].distance
                });
            }
            return res;
        };

        this.command = function(unit, command)
        {
            unit = cohort.fetch(unit);
            if (unit) {
                unit.setCommand(command);
            }
        };

        this.setTarget = function(unit, target)
        {
            unit = cohort.fetch(unit);
            if (unit) {
                unit.setTarget(target);
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

    return CohortInterface;
});