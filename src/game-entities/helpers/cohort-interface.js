define(function() {
    function CohortInterface(cohort)
    {
        this.confederates = function() {
            var res = [];
            for (var i in cohort.units) {
                var unit = cohort.units[i];
                res.push({
                    id: unit.id,
                    x: unit.x,
                    y: unit.y,
                    lives: unit.lives
                });
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
                res.push({
                    id: unit.id,
                    x: unit.x,
                    y: unit.y,
                    lives: unit.lives
                });
            }
            return res;
        };

        this.log = function(str)
        {
            console.log(str);
        };
    }

    return CohortInterface;
});