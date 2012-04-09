define(['game-entities/helpers/cohort-interface.js'], function(CohortInterface) {
    /**
     *
     * @param units
     * @param strategy Code
     */
    function Cohort(id, units, strategy, tactics)
    {
        this.id = id;
        this.units = units;
        for (var i in units) {
            units[i].cohortId = this.id;
        }
        this.strategy = strategy;
        this.tactics = tactics; // for strategy to change unit tactics
        this.sandbox = new CohortInterface(this);
    }

    Cohort.prototype.alives = function()
    {
        var res = [];
        for (var i in this.units) {
            if (this.units[i].lives > 0) {
                res.push(this.units[i]);
            }
        }
        return res;
    };

    Cohort.prototype.step = function()
    {
        if (this.strategy) {
            this.strategy.execute(this.sandbox);
        }
    };

    Cohort.prototype.contain = function(unit)
    {
        for (var i in this.units) {
            if (this.units[i] == unit) {
                return true;
            }
        }
        return false;
    };

    return Cohort;
});