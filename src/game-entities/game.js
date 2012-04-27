define(['game-entities/map.js'], function(Map) {
    function Game(cohort1, cohort2)
    {
        this.map = new Map();

        this.cohort1 = cohort1;
        for (var i in this.cohort1.units) {
            this.map.add(this.cohort1.units[i], 6 * i + 2, this.map.height - 1);
        }

        this.cohort2 = cohort2;
        for (var i in this.cohort2.units) {
            this.map.add(this.cohort2.units[i], 6 * i + 2, 0);
        }

        cohort1.enemies = cohort2;
        cohort2.enemies = cohort1;

        this.stepQueue = [];
    };

    /**
     * @return object if game over or false
     */
    Game.prototype.step = function()
    {
        if (this.stepQueue.length == 0) {
            var units1 = this.cohort1.alives();
            if (units1.length > 0) {
                this.cohort1.step();
            } else {
                return {winner: this.cohort2};
            }
            var units2 = this.cohort2.alives();
            if (units2.length > 0) {
                this.cohort2.step();
            } else {
                return {winner: this.cohort1};
            }

            this.stepQueue = units1.concat(units2);
            for (var i in this.stepQueue) {
                this.stepQueue[i].random = Math.random();
            }
            this.stepQueue.sort(function(u1, u2) {
                return u1.random - u2.random;
            });
        }

        this.stepQueue.pop().step();

        return false; // game over? no! -> false
    };

    return Game;
});