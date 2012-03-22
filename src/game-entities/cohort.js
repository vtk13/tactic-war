define(['game-entities/helpers/cohort-interface.js'], function(CohortInterface) {
    /**
     *
     * @param units
     * @param strategy Code
     */
    function Cohort(units, strategy)
    {
        this.units = units;
        this.strategy = strategy;
        this.sandbox = new CohortInterface(this);
    }

    Cohort.prototype.step = function()
    {
        this.strategy.execute(this.sandbox);
        for (var i in this.units) {
            this.units[i].step();
        }
    }

    Cohort.prototype.test = function(param)
    {
        console.log(param);
    }

    return Cohort;
});