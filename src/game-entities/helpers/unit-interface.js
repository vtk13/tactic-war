define(function() {
    function UnitInterface(unit)
    {
        this.move = function(l) {
            unit.move(l);
        };

        this.nearest = function()
        {
            return unit.map.nearest(unit);
        };

        this.log = function(str)
        {
            console.log(str);
        };
    }

    return UnitInterface;
});