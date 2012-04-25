define(['game-entities/unit.js'], function(Unit) {
    /**
     *
     * @param tactic Code
     */
    function Archer(id, tactic, rules)
    {
        Unit.apply(this, arguments);
    };

    Archer.prototype = new Unit();
    Archer.prototype.constructor = Archer;

    Archer.prototype.attackDistance = function()
    {
        return this.rules.archerAttackDistance();
    };

    Archer.prototype.maxHealth = function()
    {
        return this.rules.archerHealth();
    };

    Archer.prototype.attackPoints = function()
    {
        return this.rules.archerAttack();
    };

    Archer.prototype.armorPoints = function()
    {
        return this.rules.archerArmor();
    };

    Archer.prototype.movePoints = function()
    {
        return this.rules.archerMovePoints();
    };

    return Archer;
});