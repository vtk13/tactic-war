define(['game-entities/helpers/cohort-interface.js'], function(CohortInterface) {
    /**
     *
     * @param units
     * @param strategy Code
     */
    function Cohort(units, strategy)
    {
        this.id = Math.round(Math.random() * 1000);
        this.units = units;
        for (var i in units) {
            units[i].cohortId = this.id;
        }
        this.strategy = strategy;
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
        this.strategy.execute(this.sandbox);
        for (var i in this.units) {
            if (this.units[i].lives > 0) {
                res.push(this.units[i].step());
            }
        }
        return res;
    }

    Cohort.prototype.test = function(param)
    {
        console.log(param);
    }

    return Cohort;
});