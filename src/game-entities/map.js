define(function() {
    function Map()
    {
        this.width = 30;
        this.height = 15;
        this.mapData = [];
        for (var x = 0 ; x < this.width ; x++) {
            this.mapData[x] = new Array(this.height);
        }
        this.items = {};
    };

    /**
     *
     * @param unit must have id property
     * @param x
     * @param y
     * @return
     */
    Map.prototype.add = function(unit, x, y)
    {
        if (!this.mapData[x][y]) {
            unit.x = x;
            unit.y = y;
            unit.map = this;
            unit.direction = (x > (this.width / 2)) ? 4 : 0;

            this.mapData[x][y] = unit;
            this.items[unit.id] = unit;
        } else {
            throw new Error('Place occupied. x:' + x + ', y:' + y);
        }
    };

    Map.prototype.remove = function(unit)
    {
        delete this.items[unit.id];
    };

    /**
     *
     * @param Unit unit
     * @param int direction 0 - right, 1 - right-top, 2 - top, ..., 7 - right-bottom
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
            console.log(ex.message, unit, direction);
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

    /**
     *
     * @param x
     * @param y
     * @param radius
     * @return Unit[]
     */
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

    /**
     *
     * @param Unit from
     * @param function filter
     * @return
     */
    Map.prototype.nearest = function(from, filter)
    {
        var nearest = null;
        var distance, minDistance = Math.max(this.width, this.height) * 2;
        for (var i in this.items) {
            if (from.id && (this.items[i].id == from.id)) {
                continue;
            }
            if (filter && !filter(this.items[i])) {
                continue;
            }
            distance = this.distance(from, this.items[i]);
            if (distance < minDistance) {
                nearest = this.items[i];
                minDistance = distance;
            }
        }
        return nearest;
    };

    Map.prototype.nearests = function(from, filter)
    {
        var nearests = [];
        for (var i in this.items) {
            if (from.id && (this.items[i].id == from.id)) {
                continue;
            }
            if (filter && !filter(this.items[i])) {
                continue;
            }
            nearests.push({
                unit: this.items[i],
                distance: this.distance(from, this.items[i])
            });
        }
        nearests.sort(function(a, b) {
            return a.distance - b.distance;
        });
        return nearests;
    };

    Map.prototype.distance = function(from, to)
    {
        if (from.id) {
            from = this.fetch(from);
        }
        if (to.id) {
            to = this.fetch(to);
        }
        if (from && to) {
            var x = to.x - from.x;
            var y = to.y - from.y;
            return Math.sqrt(x*x + y*y);
        } else {
            return undefined;
        }
    };

    Map.prototype.direction = function(from, to)
    {
        if (from.id) {
            from = this.fetch(from);
        }
        if (to.id) {
            to = this.fetch(to);
        }

        if (from && to) {
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
        } else {
            return undefined;
        }
    };

    Map.prototype.fetch = function(unit)
    {
        if (this.items[unit.id]) {
            return this.items[unit.id];
        } else {
            console.log(this.items, unit);
            throw new Error('Unit doensn\'t exists on map');
        }
    };

    Map.prototype.path = function(from, to, raw)
    {
        if (from.hasOwnProperty('id')) { // Unit or SafeProxy
            from = this.fetch(from);
        } // else is just an object {x: NNN, y: NNN}
        if (to.hasOwnProperty('id')) {
            to = this.fetch(to);
        }
        var wayfinder = new AStarWayfinder(this, from, to);
        var p = wayfinder.run();
        if (raw) {
            return p;
        }
        if (p) {
            if (p.parent) {
                p = p.parent;
            }
            var res = [];
            while (p.parent) {
                res.unshift(this.direction(p.parent, p));
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
        this.hashes = [];
        n = 0;
    };

    OpenQueue.prototype.add = function(item)
    {
        if (!this.fetch(item)) {
            this.hashes[item.hash] = item;

            // binary search
            var first = 0, a = this.items, last = n = a.length, mid, f = item.f;
            if (n == 0) {
                this.items.push(item);
                return;
            } else if (a[0].f > f) {
                a.unshift(item);
                return;
            } else if (a[last - 1].f < f) {
                a.push(item);
                return;
            }

            while (first < last) {
                mid = (first + last) >> 1;
                if (f <= a[mid].f) {
                    last = mid;
                } else {
                    first = mid + 1;
                }
            }
            this.items.splice(last, 0, item);

            // simple search
//            for (var i in this.items) {
//                if (this.items[i].f > item.f) {
//                    this.items.splice(i, 0, item);
//                    return;
//                }
//            }
//            // if doesn't returns, add last
//            this.items.push(item);
        }
    };

    OpenQueue.prototype.next = function()
    {
        var res = this.items.shift();
        if (res) {
            delete this.hashes[res.hash];
        }
        return res;
    };

    OpenQueue.prototype.fetch = function(item)
    {
        return this.hashes[item.hash];
    };


    function CloseList()
    {
        this.hashes = [];
    };

    CloseList.prototype.add = function(item)
    {
        this.hashes[item.hash] = item;
    };

    CloseList.prototype.fetch = function(item)
    {
        return this.hashes[item.hash];
    };

    CloseList.prototype.remove = function(item)
    {
        delete this.hashes[item.hash];
    };

    function AStarWayfinder(map, from, to)
    {
        this.map = map;
        this.from = this.p(from.x, from.y);
        this.to = this.p(to.x, to.y);
    };

    /**
     * @fixme if no fay?
     */
    AStarWayfinder.prototype.guess = function(from, to)
    {
        return 1 * (Math.abs(to.x - from.x) + Math.abs(to.y - from.y));
    };

    AStarWayfinder.prototype.p = function(x, y)
    {
        return {
            hash: x * this.map.height + y,
            x: x,
            y: y
        };
    }

    AStarWayfinder.prototype.siblings = function(p)
    {
        var maxx = this.map.width - 1;
        var maxy = this.map.height - 1;
        var res = [];
        // 3 left
        if (p.x > 0) {
            if (p.y > 0) res.push(this.p(p.x-1, p.y-1));
            res.push(this.p(p.x-1, p.y));
            if (p.y < maxy) res.push(this.p(p.x-1, p.y+1));
        }

        // top and bottom
        if (p.y > 0) res.push(this.p(p.x, p.y-1));
        if (p.y < maxy) res.push(this.p(p.x, p.y+1));

        // 3 right
        if (p.x < maxx) {
            if (p.y > 0) res.push(this.p(p.x+1, p.y-1));
            res.push(this.p(p.x+1, p.y));
            if (p.y < maxx) res.push(this.p(p.x+1, p.y+1));
        }
        return res;
    };

    AStarWayfinder.prototype.equals = function(p1, p2)
    {
        return p1.x == p2.x && p1.y == p2.y;
    };

    AStarWayfinder.prototype.run = function()
    {
        var open = new OpenQueue(this.map);
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
                    weight = 100;
                } else {
                    weight = 1;
                }
                var newg = next.g + weight;
                var fetched = open.fetch(each) || close.fetch(each);
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
            close.add(next);
        }
        return false;
    };



    return Map;
});