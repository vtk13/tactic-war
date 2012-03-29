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


    Category1.prototype.footmanSpeed = function()
    {
        return 10;
    };

    Category1.prototype.footmanLives = function()
    {
        return 100;
    };

    Category1.prototype.footmanAttack = function()
    {
        return 10;
    };

    Category1.prototype.footmanArmor = function()
    {
        return 2;
    };

    Category1.prototype.footmanAttackDistance = function()
    {
        return 20;
    };

    return Category1;
});