define([], function() {
    function Player(logger, canvas)
    {
        this.units = [];
        this.gridSize = Player.gridSize;
        this.c2d = canvas.getContext('2d');
        this.setSource(logger);
    };

    Player.gridSize = 20;

    Player.prototype.setSource = function(logger)
    {
        if (logger) {
            this.units = [];
            var self = this;
            logger.on('change', function(items) {
                for (var i in items) {
                    var unit = items[i];
                    if (self.units[unit.id] == undefined) {
                        self.units[unit.id] = {};
                    }
                    for (var j in unit) {
                        if (j == 'x' || j == 'y') {
                            unit[j] = unit[j] * self.gridSize + self.gridSize / 2;
                        }
                        if (j == 'direction') {
                            unit[j] = unit[j] * Math.PI / 4;
                        }
                        self.units[unit.id][j] = unit[j];
                    }
                }
                self.draw();
            });
            logger.init();
        }
    };

    Player.prototype.draw = function()
    {
        var ctx = this.c2d;
        ctx.fillStyle = '#DCEBDD';
        ctx.fillRect(0, 0, 600, 300);

        ctx.strokeStyle = '#ccc';
        ctx.lineWidth = 1;
        for (var x = this.gridSize ; x < 600 ; x += this.gridSize) {
            ctx.beginPath();
            ctx.moveTo(x + 0.5, 0);
            ctx.lineTo(x + 0.5, 300);
            ctx.stroke();
        }
        for (var y = this.gridSize ; y < 300 ; y += this.gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y + 0.5);
            ctx.lineTo(600, y + 0.5);
            ctx.stroke();
        }

        var units = [];

        for (var i in this.units) {
            units.push(this.units[i]);
        }
        units.sort(function(a, b) {
            if (a.y < b.y) return -1;
            if (a.y > b.y) return 1;
            return 0;
        });

        for (var i in units) {
            if (units[i].type == 'Footman') {
                this.drawUnit(units[i], '#B64926');
            }
            if (units[i].type == 'Archer') {
                this.drawUnit(units[i], '#f5d277');
            }
            if (units[i].type == 'Ballista') {
                this.drawUnit(units[i], '#7ba2d3');
            }
        }
    };

    Player.prototype.drawUnit = function(unit, color)
    {
        var ctx = this.c2d;
        var size = 7;
        if (unit.health > 0) {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(unit.x, unit.y, size, 0, Math.PI*2, true);
            ctx.closePath();
            ctx.fill();
            if (unit.selected) {
                ctx.strokeStyle = '#000';
                ctx.stroke();
            }

            ctx.beginPath();
            ctx.moveTo(unit.x, unit.y);
            ctx.lineTo(unit.x + Math.cos(unit.direction) * size, unit.y + Math.sin(unit.direction) * size);
            ctx.strokeStyle = '#fff';
            ctx.stroke();

            // live bar
            ctx.beginPath();
            ctx.moveTo(Math.round(unit.x - size), Math.round(unit.y - size - 2));
            ctx.lineTo(Math.round(unit.x + size), Math.round(unit.y - size - 2));
            ctx.strokeStyle = '#666';
            ctx.stroke();

            var livePercent = unit.health / unit.maxHealth;

            ctx.beginPath();
            ctx.moveTo(Math.round(unit.x - size), Math.round(unit.y - size - 2));
            ctx.lineTo(Math.round(unit.x - size + livePercent * size * 2), Math.round(unit.y - size - 2));
            ctx.strokeStyle = '#8E2800';
            ctx.stroke();
        } else {
            ctx.fillStyle = '#000';
            ctx.beginPath();
            ctx.arc(unit.x, unit.y, size, 0, Math.PI*2, true);
            ctx.closePath();
            ctx.fill();
        }
    };

    return Player;
});