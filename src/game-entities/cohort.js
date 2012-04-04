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
        for (var i in this.units) {
            if (this.units[i].lives > 0) {
                return true;
            }
        }
        return false;
    };

    Cohort.prototype.step = function()
    {
        var res = [];
        if (this.strategy) {
            this.strategy.execute(this.sandbox);
        }
        for (var i in this.units) {
            if (this.units[i].lives > 0) {
                res.push(this.units[i].step());
            }
        }
        return res;
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

    Cohort.prototype.test = function(param)
    {
        console.log(param);
    };

    return Cohort;
});