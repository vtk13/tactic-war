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
            },
            'ballista': {
                cost: 45
            }
        };
    };


    Category1.prototype.footmanCost             = function() { return  20; };
    Category1.prototype.footmanSpeed            = function() { return  10; };
    Category1.prototype.footmanLives            = function() { return 100; };
    Category1.prototype.footmanAttack           = function() { return  10; };
    Category1.prototype.footmanArmor            = function() { return   2; };
    Category1.prototype.footmanAttackDistance   = function() { return  20; };

    Category1.prototype.archerCost              = function() { return  25; };
    Category1.prototype.archerSpeed             = function() { return  10; };
    Category1.prototype.archerLives             = function() { return  60; };
    Category1.prototype.archerAttack            = function() { return   6; };
    Category1.prototype.archerArmor             = function() { return   1; };
    Category1.prototype.archerAttackDistance    = function() { return 100; };

    Category1.prototype.ballistaCost            = function() { return  45; };
    Category1.prototype.ballistaSpeed           = function() { return   6; };
    Category1.prototype.ballistaLives           = function() { return 110; };
    Category1.prototype.ballistaAttack          = function() { return  20; };
    Category1.prototype.ballistaArmor           = function() { return   0; };
    Category1.prototype.ballistaAttackDistance  = function() { return 100; };
    Category1.prototype.ballistaSplashRadius    = function() { return  25; };

    Category1.prototype.getAllParams = function()
    {
        return {
            footmanCost             : this.footmanCost(),
            footmanSpeed            : this.footmanSpeed(),
            footmanLives            : this.footmanLives(),
            footmanAttack           : this.footmanAttack(),
            footmanArmor            : this.footmanArmor(),
            footmanAttackDistance   : this.footmanAttackDistance(),

            archerCost              : this.archerCost(),
            archerSpeed             : this.archerSpeed(),
            archerLives             : this.archerLives(),
            archerAttack            : this.archerAttack(),
            archerArmor             : this.archerArmor(),
            archerAttackDistance    : this.archerAttackDistance(),

            ballistaCost            : this.ballistaCost(),
            ballistaSpeed           : this.ballistaSpeed(),
            ballistaLives           : this.ballistaLives(),
            ballistaAttack          : this.ballistaAttack(),
            ballistaArmor           : this.ballistaArmor(),
            ballistaAttackDistance  : this.ballistaAttackDistance(),
            ballistaSplashRadius    : this.ballistaSplashRadius()
        };
    };

    return Category1;
});