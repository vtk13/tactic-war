var map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 2, 2, 2, 2, 1, 1],
    [1, 1, 1, 2, 3, 3, 4, 2, 1, 1],
    [1, 1, 1, 2, 4, 6, 4, 2, 1, 1],
    [1, 1, 2, 4, 6, 6, 4, 2, 1, 1],
    [1, 2, 4, 4, 4, 4, 4, 2, 1, 1],
    [2, 2, 2, 2, 2, 2, 2, 2, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

var size = 10;

var from = {x: 0, y: 0}, to = {x: 9, y: 9};

var open = {
    items: [],
    add: function(item) {
        if (!this.contain(item)) {
            for (var i in this.items) {
                if (this.items[i].f > item.f) {
                    this.items.splice(i, 0, item);
                    return;
                }
            }
            this.items.push(item);
        }
    },
    next: function()
    {
        return this.items.shift();
    },
    contain: function(p)
    {
        for (var i in this.items) {
            if (this.items[i].x == p.x && this.items[i].y == p.y) {
                return this.items[i];
            }
        }
        return false;
    }
};

var close = {
    items: [],
    contain: open.contain,
    remove: function(p)
    {
        for (var i in this.items) {
            if (this.items[i].x == p.x && this.items[i].y == p.y) {
                this.items.splice(i, 1);
                return;
            }
        }
    }
}

function guess(from, to)
{
    return 1.5 * (Math.abs(to.x - from.x) + Math.abs(to.y - from.y));
}

function siblings(p)
{
    var max = size - 1;
    var res = [];
    // 3 left
    if (p.x > 0) {
        if (p.y > 0) res.push({x: p.x-1, y: p.y-1});
        res.push({x: p.x-1, y: p.y});
        if (p.y < max) res.push({x: p.x-1, y: p.y+1});
    }

    // top bottom
    if (p.y > 0) res.push({x: p.x, y: p.y-1});
    if (p.y < max) res.push({x: p.x, y: p.y+1});

    // 3 right
    if (p.x < max) {
        if (p.y > 0) res.push({x: p.x+1, y: p.y-1});
        res.push({x: p.x+1, y: p.y});
        if (p.y < max) res.push({x: p.x+1, y: p.y+1});
    }
    return res;
}

function equals(p1, p2)
{
    return p1.x == p2.x && p1.y == p2.y;
}

function run()
{
    from.g = 0;
    from.h = guess(from, to);
    from.f = from.g + from.h;

    open.add(from);

    var next;
    while (next = open.next()) {
        if (equals(to, next)) {
            return next;
        }
        var sib = siblings(next);
        for (var i in sib) {
            var each = sib[i];
            var newg = next.g + map[each.y][each.x];
            var fetched = open.contain(each) || close.contain(each);
            if (fetched && fetched.g <= newg) {
                continue;
            }

            each.parent = next;
            each.g = newg;
            each.h = guess(each, to);
            each.f = each.g + each.h;

            close.remove(each);
            open.add(each);
        }
    }
}

var ctx = document.getElementById('field').getContext('2d');

for (var y in map) {
    for (var x in map) {
        ctx.beginPath();
        ctx.arc(x * 10 + 5, y * 10 + 5, 5, 0, Math.PI*2, true);
        ctx.closePath();
        ctx.fillStyle = '#' + (10 - map[y][x]) + (10 - map[y][x]) + (10 - map[y][x]);
        ctx.fill();
    }
}

var p = run();
console.log(p.g);
ctx.moveTo(p.x * 10 + 5, p.y * 10 + 5);
while (p.parent) {
    p = p.parent;
    ctx.lineTo(p.x * 10 + 5, p.y * 10 + 5);
}
ctx.stroke();