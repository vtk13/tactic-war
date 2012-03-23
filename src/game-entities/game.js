define(['game-entities/map.js'], function(Map) {
    function Game(cohort1, cohort2)
    {
        this.map = new Map();

        this.cohort1 = cohort1;
        for (var i in this.cohort1.units) {
            this.map.add(this.cohort1.units[i], 10 * (i + 1), this.map.height - 10);
        }

        this.cohort2 = cohort2;
        for (var i in this.cohort2.units) {
            this.map.add(this.cohort2.units[i], 10 * (i + 1), 10);
        }
    }

    Game.prototype.step = function()
    {
        if (this.cohort1.alives()) {
            this.cohort1.step();
        } else {
            return {winner: this.cohort2};
        }
        if (this.cohort2.alives()) {
            this.cohort2.step();
        } else {
            return {winner: this.cohort1};
        }
        return false;
    }

    return Game;
});