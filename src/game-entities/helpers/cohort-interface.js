define(function() {
    function CohortInterface(cohort)
    {
        this.store = {};

        this.confederates = function() {
            var res = [];
            for (var i in cohort.units) {
                var unit = cohort.units[i];
                if (unit.lives > 0) {
                    res.push({
                        id: unit.id,
                        type: unit.constructor.name,
                        lives: unit.lives,
                        x: unit.x,
                        y: unit.y
                    });
                }
            }
            return res;
        };

        this.setTarget = function(unit, target)
        {
            for (var i in cohort.units) {
                if (cohort.units[i].id == unit.id) {
                    cohort.units[i].setTarget(target);
                }
            }
        };

        this.enemies = function() {
            var res = [];
            for (var i in cohort.enemies.units) {
                var unit = cohort.enemies.units[i];
                if (unit.lives > 0) {
                    res.push({
                        id: unit.id,
                        type: unit.constructor.name,
                        lives: unit.lives,
                        x: unit.x,
                        y: unit.y
                    });
                }
            }
            return res;
        };

        if (typeof window == undefined) {
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