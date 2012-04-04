define(function() {
    function Category1()
    {

    };

    Category1.prototype.name = function()
    {
        return 'rules-category1';
    };

    Category1.prototype.maxCost = function()
    {
        return 100;
    };

    Category1.prototype.maxSteps = function()
    {
        return 400;
    };

    Category1.prototype.availableUnits = function()
    {
        return {
            'footman': {
                cost: 20
            },
            'archer': {
                cost: 25
            }
        };
    };


    Category1.prototype.footmanSpeed            = function() { return  10; };
    Category1.prototype.footmanLives            = function() { return 100; };
    Category1.prototype.footmanAttack           = function() { return  10; };
    Category1.prototype.footmanArmor            = function() { return   2; };
    Category1.prototype.footmanAttackDistance   = function() { return  20; };

    Category1.prototype.archerSpeed             = function() { return  10; };
    Category1.prototype.archerLives             = function() { return  60; };
    Category1.prototype.archerAttack            = function() { return   6; };
    Category1.prototype.archerArmor             = function() { return   1; };
    Category1.prototype.archerAttackDistance    = function() { return 100; };

    return Category1;
});