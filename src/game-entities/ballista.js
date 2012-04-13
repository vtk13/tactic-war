define(['game-entities/unit.js'], function(Unit) {
    /**
     *
     * @param tactic Code
     */
    function Ballista(id, tactic, rules)
    {
        Unit.apply(this, arguments);
    };

    Ballista.prototype = new Unit();
    Ballista.prototype.constructor = Ballista;



    Ballista.prototype.attack = function(target)
    {
        target = this.map.fetch(target);
        if (this.actionPoints && this.canAttack(target)) {
            this.turn(this.map.direction(this, target));
            var around = this.map.around(target.x, target.y, this.rules.ballistaSplashRadius());
            for (var i in around) {
                if (this.cohortId != around[i].cohortId) {
                    around[i].hit(this.attackPoints());
                }
            }
            this.actionPoints--;
        }
    };

    Ballista.prototype.attackDistance = function()
    {
        return this.rules.ballistaAttackDistance();
    };

    Ballista.prototype.maxLives = function()
    {
        return this.rules.ballistaLives();
    };

    Ballista.prototype.attackPoints = function()
    {
        return this.rules.ballistaAttack();
    };

    Ballista.prototype.armorPoints = function()
    {
        return this.rules.ballistaArmor();
    };

    Ballista.prototype.speedPoints = function()
    {
        return this.rules.ballistaSpeed();
    };

    return Ballista;
});