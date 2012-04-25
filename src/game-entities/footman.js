define(['game-entities/unit.js'], function(Unit) {
    /**
     *
     * @param tactic Code
     */
    function Footman(id, tactic, rules)
    {
        Unit.apply(this, arguments);
    };

    Footman.prototype = new Unit();
    Footman.prototype.constructor = Footman;

    Footman.prototype.attackDistance = function()
    {
        return this.rules.footmanAttackDistance();
    };

    Footman.prototype.maxHealth = function()
    {
        return this.rules.footmanHealth();
    };

    Footman.prototype.attackPoints = function()
    {
        return this.rules.footmanAttack();
    };

    Footman.prototype.armorPoints = function()
    {
        return this.rules.footmanArmor();
    };

    Footman.prototype.movePoints = function()
    {
        return this.rules.footmanMovePoints();
    };

    return Footman;
});