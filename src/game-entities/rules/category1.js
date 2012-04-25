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
    Category1.prototype.footmanMovePoints       = function() { return   4; };
    Category1.prototype.footmanHealth           = function() { return 100; };
    Category1.prototype.footmanAttack           = function() { return  10; };
    Category1.prototype.footmanArmor            = function() { return   2; };
    Category1.prototype.footmanAttackDistance   = function() { return 1.5; };

    Category1.prototype.archerCost              = function() { return  25; };
    Category1.prototype.archerMovePoints        = function() { return   5; };
    Category1.prototype.archerHealth            = function() { return  60; };
    Category1.prototype.archerAttack            = function() { return   6; };
    Category1.prototype.archerArmor             = function() { return   1; };
    Category1.prototype.archerAttackDistance    = function() { return   4; };

    Category1.prototype.ballistaCost            = function() { return  45; };
    Category1.prototype.ballistaMovePoints      = function() { return   3; };
    Category1.prototype.ballistaHealth          = function() { return 110; };
    Category1.prototype.ballistaAttack          = function() { return  20; };
    Category1.prototype.ballistaArmor           = function() { return   0; };
    Category1.prototype.ballistaAttackDistance  = function() { return   7; };
    Category1.prototype.ballistaSplashRadius    = function() { return   3; };

    Category1.prototype.getAllParams = function()
    {
        return {
            footmanCost             : this.footmanCost(),
            footmanMovePoints       : this.footmanMovePoints(),
            footmanHealth           : this.footmanHealth(),
            footmanAttack           : this.footmanAttack(),
            footmanArmor            : this.footmanArmor(),
            footmanAttackDistance   : this.footmanAttackDistance(),

            archerCost              : this.archerCost(),
            archerMovePoints        : this.archerMovePoints(),
            archerHealth            : this.archerHealth(),
            archerAttack            : this.archerAttack(),
            archerArmor             : this.archerArmor(),
            archerAttackDistance    : this.archerAttackDistance(),

            ballistaCost            : this.ballistaCost(),
            ballistaMovePoints      : this.ballistaMovePoints(),
            ballistaHealth          : this.ballistaHealth(),
            ballistaAttack          : this.ballistaAttack(),
            ballistaArmor           : this.ballistaArmor(),
            ballistaAttackDistance  : this.ballistaAttackDistance(),
            ballistaSplashRadius    : this.ballistaSplashRadius()
        };
    };

    return Category1;
});