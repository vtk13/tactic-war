define(function() {
    function Map()
    {
        this.width = 600;
        this.height = 300;
        this.items = [];
    };

    Map.prototype.add = function(unit, x, y)
    {
        unit.x = x;
        unit.y = y;
        unit.map = this;
        this.items.push(unit);
    };

    Map.prototype.remove = function(unit)
    {
        for (var i in this.items) {
            if (this.items[i] == unit) {
                delete this.items[i];
                break;
            }
        }
    };

    Map.prototype.nearest = function(unit)
    {
        var unitIndex = this.find(unit);

        var distance, minIndex = -1, minDistance = Math.max(this.width, this.height) * 2;
        for (var i in this.items) {
            if (i == unitIndex) continue;
            distance = this.distance(unitIndex, i);
            if (distance < minDistance) {
                minIndex = i;
                minDistance = distance;
            }
        }
        return this.items[minIndex];
    };

    Map.prototype.distance = function(from, to)
    {
        var fromIndex   = typeof from != 'object' ? from : this.find(from);
        var toIndex     = typeof to != 'object' ? to : this.find(to);

        var x1 = this.items[fromIndex].x;
        var x2 = this.items[toIndex].x;
        var y1 = this.items[fromIndex].y;
        var y2 = this.items[toIndex].y;
        return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
    };

    Map.prototype.find = function(unit)
    {
        for (var i in this.items) {
            if (this.items[i] == unit) {
                return i;
            }
        }
        throw new Error('Unit doensn\'t exists on map');
    }

    return Map;
});