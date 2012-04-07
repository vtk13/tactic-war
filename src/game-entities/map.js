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

        unit.direction = (y > (this.height / 2)) ? Math.PI * 3 / 2 : Math.PI / 2; // 0 is right (x: 1, y: 0)

        unit.map = this;
        this.items.push(unit);
    };

    Map.prototype.remove = function(unit)
    {
        var index = this.find(unit);
        delete this.items[index];
    };

    Map.prototype.move = function(unit, distance)
    {
        var x = unit.x + Math.cos(unit.direction) * distance;
        var y = unit.y + Math.cos(unit.direction) * distance;
        if (isFinite(x) && isFinite(y)) {
            if (x < 0) x = 0;
            if (y < 0) y = 0;
            if (x > this.width) x = this.width;
            if (y > this.height) y = this.height;
            unit._set('x', unit.x + Math.cos(unit.direction) * distance);
            unit._set('y', unit.y + Math.sin(unit.direction) * distance);
        }
    };

    Map.prototype.findByXY = function(x, y)
    {
        var nearest = null, minDistance = Math.max(this.width, this.height) * 2;
        for (var i in this.items) {
            var ix = this.items[i].x, iy = this.items[i].y;
            var distance = Math.sqrt((x-ix)*(x-ix) + (y-iy)*(y-iy));
            if (distance < minDistance) {
                minDistance = distance;
                nearest = this.items[i];
            }
        }
        return nearest;
    };

    Map.prototype.around = function(x, y, radius)
    {
        var res = [];
        for (var i in this.items) {
            var dx = x - this.items[i].x;
            var dy = y - this.items[i].y;
            if (Math.sqrt(dx*dx + dy*dy) <= radius) {
                res.push(this.items[i]);
            }
        }
        return res;
    };

    Map.prototype.nearest = function(unit, filter)
    {
        var unitIndex = this.find(unit);

        var distance, minIndex = -1, minDistance = Math.max(this.width, this.height) * 2;
        for (var i in this.items) {
            if (i == unitIndex) continue;
            distance = this.distance(unitIndex, i);
            if (distance < minDistance) {
                if (filter && !filter(this.items[i])) {
                    continue;
                }
                minIndex = i;
                minDistance = distance;
            }
        }
        return this.items[minIndex];
    };

    Map.prototype.distance = function(from, to)
    {
        if (!from || !to) {
            return undefined;
        }
        var fromIndex   = typeof from != 'object' ? from : this.find(from);
        var toIndex     = typeof to != 'object' ? to : this.find(to);

        var x = this.items[toIndex].x - this.items[fromIndex].x;
        var y = this.items[toIndex].y - this.items[fromIndex].y;
        return Math.sqrt(x*x + y*y);
    };

    Map.prototype.direction = function(from, to)
    {
        var fromIndex   = typeof from != 'object' ? from : this.find(from);
        var toIndex     = typeof to != 'object' ? to : this.find(to);

        var x = this.items[toIndex].x - this.items[fromIndex].x;
        var y = this.items[toIndex].y - this.items[fromIndex].y;

//        var x2 = 1;
//        var y2 = 0;
//        var cos = (x * x2 + y * y2) / ( Math.sqrt(x*x + y*y) * Math.sqrt(x2*x2 + y2*y2) );

        var cos = x / Math.sqrt(x*x + y*y);
        var direction = Math.acos(cos);

        // сектор 1: x>0, y>0, 2: x<0, y>0, 3: x<0, y<0, 4: x>0, y<0
        // cos > 0 -> сектор 1,4
        // y > 0 -> сектор 1,2
        if (y < 0) {
            direction = -direction;
        }
        return direction;
    }

    Map.prototype.find = function(unit)
    {
        for (var i in this.items) {
            if (this.items[i].id == unit.id) {
                return i;
            }
        }
        throw new Error('Unit doensn\'t exists on map');
    };

    Map.prototype.fetch = function(unit)
    {
        for (var i in this.items) {
            if (this.items[i].id == unit.id) {
                return this.items[i];
            }
        }
        throw new Error('Unit doensn\'t exists on map');
    };

    return Map;
});