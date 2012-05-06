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

    /**
     *
     * @param bool proxy
     * @return
     */
    Cohort.prototype.alives = function(proxy)
    {
        var res = [];
        for (var i in this.units) {
            if (this.units[i].health > 0) {
                if (proxy) {
                    res.push(this.units[i].proxy);
                } else {
                    res.push(this.units[i]);
                }
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

    /**
     * @deprecated
     * @param unit Unit|SafeProxy
     * @return
     */
    Cohort.prototype.contain = function(unit)
    {
        return this.fetch(unit);
    };

    /**
     *
     * @param unit Unit|SafeProxy
     * @return
     */
    Cohort.prototype.fetch = function(unit)
    {
        for (var i in this.units) {
            if (this.units[i].id == unit.id) {
                return this.units[i];
            }
        }
        return null;
    };

    return Cohort;
});