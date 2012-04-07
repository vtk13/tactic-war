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

    Ballista.prototype._doAttack = function(action)
    {
        var target = action.target;
        this._set('direction', this.map.direction(this, action.target));
        var around = this.map.around(target.x, target.y, this.rules.ballistaSplashRadius());
        for (var i in around) {
            if (this.cohortId != around[i].cohortId) {
                around[i].hit(this.attackPoints());
            }
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