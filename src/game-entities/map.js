define(function() {
    function Map()
    {
        this.width = 30;
        this.height = 15;
        this.mapData = [];
        for (var x = 0 ; x < this.width ; x++) {
            this.mapData[x] = new Array(this.height);
        }
        this.items = [];
    };

    Map.prototype.add = function(unit, x, y)
    {
        if (!this.mapData[x][y]) {
            unit.x = x;
            unit.y = y;
            unit.map = this;
            unit.direction = (y > (this.height / 2)) ? 6 : 2;

            this.mapData[x][y] = unit;
            this.items.push(unit);
        } else {
            throw new Error('Place occupied. x:' + x + ', y:' + y);
        }
    };

    Map.prototype.remove = function(unit)
    {
        var index = this.find(unit);
        delete this.items[index];
    };

    /**
     *
     * @param unit
     * @param direction 0 - right, 1 - right-top, 2 - top, ..., 7 - right-bottom
     * @return bool
     */
    Map.prototype.step = function(unit, direction)
    {
        // switch should be much faster
        var dx = Math.round(Math.cos(direction * Math.PI / 4));
        var dy = Math.round(Math.sin(direction * Math.PI / 4));
        var nx = Math.min(Math.max(unit.x + dx, 0), this.width - 1);
        var ny = Math.min(Math.max(unit.y + dy, 0), this.height - 1);
        try {
            if (this.mapData[nx][ny]) {
                return false;
            } else {
                this.mapData[unit.x][unit.y] = null;
                this.mapData[nx][ny] = unit;
                unit.setPosition(nx, ny);
                return true;
            }
        } catch (ex) {
            console.log(unit, direction);
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

    Map.prototype.hide = function(unit)
    {
        if (this.mapData[unit.x] && this.mapData[unit.x][unit.y]) {
            this.mapData[unit.x][unit.y] = null;
        }
    };

    Map.prototype.nearest = function(unit, filter)
    {
        var unitIndex = this.find(unit);

        var distance, minIndex = -1, minDistance = Math.max(this.width, this.height) * 2;
        for (var i in this.items) {
            if (i == unitIndex) continue;
            distance = this.distance(unitIndex, i);
            if (filter && !filter(this.items[i])) {
                continue;
            }
            if (distance < minDistance) {
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

    /**
     * @deprecated
     */
    Map.prototype.direction = function(from, to)
    {
        var fromIndex   = typeof from != 'object' ? from : this.find(from);
        var toIndex     = typeof to != 'object' ? to : this.find(to);

        return this._direction(this.items[fromIndex], this.items[toIndex]);
    };

    Map.prototype._direction = function(from, to)
    {
        var x = to.x - from.x;
        var y = to.y - from.y;

//        var x2 = 1;
//        var y2 = 0;
//        var cos = (x * x2 + y * y2) / ( Math.sqrt(x*x + y*y) * Math.sqrt(x2*x2 + y2*y2) );

        var cos = x / Math.sqrt(x*x + y*y);
        var direction = Math.acos(cos);

        // сектор 1: x>0, y>0, 2: x<0, y>0, 3: x<0, y<0, 4: x>0, y<0
        // cos > 0 -> сектор 1,4
        // y > 0 -> сектор 1,2
        if (y < 0) {
            direction = - direction;
        }
        return Math.round(direction * 4 / Math.PI);
    };

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

    Map.prototype.path = function(from, to)
    {
        var wayfinder = new AStarWayfinder(this, from, to);
        var p = wayfinder.run();
        if (p) {
            if (p.parent) {
                p = p.parent;
            }
            var res = [];
            while (p.parent) {
                res.unshift(this._direction(p.parent, p));
                p = p.parent;
            }
            return res;
        } else {
            return false;
        }
    };



    function OpenQueue()
    {
        this.items = [];
    };

    OpenQueue.prototype.add = function(item)
    {
        if (!this.contain(item)) {
            for (var i in this.items) {
                if (this.items[i].f > item.f) {
                    this.items.splice(i, 0, item);
                    return;
                }
            }
            this.items.push(item);
        }
    };

    OpenQueue.prototype.next = function()
    {
        return this.items.shift();
    };

    OpenQueue.prototype.contain = function(p)
    {
        for (var i in this.items) {
            if (this.items[i].x == p.x && this.items[i].y == p.y) {
                return this.items[i];
            }
        }
        return false;
    };


    function CloseList()
    {
        this.items = [];
    };

    CloseList.prototype.contain = OpenQueue.prototype.contain;

    CloseList.prototype.remove = function(p)
    {
        for (var i in this.items) {
            if (this.items[i].x == p.x && this.items[i].y == p.y) {
                this.items.splice(i, 1);
                return;
            }
        }
    };

    function AStarWayfinder(map, from, to)
    {
        this.map = map;
        this.from = from;
        this.to = to;
    };

    AStarWayfinder.prototype.guess = function(from, to)
    {
        return 1 * (Math.abs(to.x - from.x) + Math.abs(to.y - from.y));
    };

    AStarWayfinder.prototype.siblings = function(p)
    {
        var maxx = this.map.width - 1;
        var maxy = this.map.height - 1;
        var res = [];
        // 3 left
        if (p.x > 0) {
            if (p.y > 0) res.push({x: p.x-1, y: p.y-1});
            res.push({x: p.x-1, y: p.y});
            if (p.y < maxy) res.push({x: p.x-1, y: p.y+1});
        }

        // top and bottom
        if (p.y > 0) res.push({x: p.x, y: p.y-1});
        if (p.y < maxy) res.push({x: p.x, y: p.y+1});

        // 3 right
        if (p.x < maxx) {
            if (p.y > 0) res.push({x: p.x+1, y: p.y-1});
            res.push({x: p.x+1, y: p.y});
            if (p.y < maxx) res.push({x: p.x+1, y: p.y+1});
        }
        return res;
    };

    AStarWayfinder.prototype.equals = function(p1, p2)
    {
        return p1.x == p2.x && p1.y == p2.y;
    };

    AStarWayfinder.prototype.run = function()
    {
        var open = new OpenQueue();
        var close = new CloseList();
        this.from.g = 0;
        this.from.h = this.guess(this.from, this.to);
        this.from.f = this.from.g + this.from.h;

        open.add(this.from);

        var next, weight, each;
        while (next = open.next()) {
            if (this.equals(this.to, next)) {
                return next;
            }
            var sib = this.siblings(next);
            for (var i in sib) {
                each = sib[i];
                if (this.map.mapData[each.x][each.y] && !this.equals(each, this.to)) {
                    weight = 10000;
                } else {
                    weight = 1;
                }
                var newg = next.g + weight;
                var fetched = open.contain(each) || close.contain(each);
                if (fetched && fetched.g <= newg) {
                    continue;
                }

                each.parent = next;
                each.g = newg;
                each.h = this.guess(each, this.to);
                each.f = each.g + each.h;

                close.remove(each);
                open.add(each);
            }
        }
        return false;
    };



    return Map;
});