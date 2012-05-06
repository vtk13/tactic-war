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