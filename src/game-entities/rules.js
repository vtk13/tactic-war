define(['game-entities/footman.js'], function(Footman) {
    function Rules()
    {

    };

    Rules.prototype.footmanSpeed = function()
    {
        return 10;
    };

    Rules.prototype.footmanLives = function()
    {
        return 100;
    };

    Rules.prototype.footmanAttack = function()
    {
        return 10;
    };

    Rules.prototype.footmanArmor = function()
    {
        return 2;
    };

    Rules.prototype.footmanAttackDistance = function()
    {
        return 20;
    };

    return Rules;
});