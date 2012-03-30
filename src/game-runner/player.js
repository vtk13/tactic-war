define(['game-entities/footman.js'], function(Footman) {
    function Player(logger, canvas)
    {
        this.units = [];
        this.c2d = canvas.getContext('2d');
        this.setSource(logger);
    };

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
        ctx.fillStyle = '#468966';
        ctx.fillRect(0, 0, 600, 300);

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
        }
    };

    Player.prototype.drawUnit = function(unit, color)
    {
        var ctx = this.c2d;
        var size = 7;
        if (unit.lives > 0) {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(unit.x, unit.y, size, 0, Math.PI*2, true);
            ctx.closePath();
            ctx.fill();
            if (unit.selected) {
                ctx.strokeStyle = '#fff';
                ctx.stroke();
            }

            ctx.beginPath();
            ctx.moveTo(unit.x, unit.y);
            ctx.lineTo(unit.x + Math.cos(unit.direction) * size, unit.y + Math.sin(unit.direction) * size);
            ctx.strokeStyle = '#000';
            ctx.stroke();

            // live bar
            ctx.beginPath();
            ctx.moveTo(unit.x - size, unit.y - size - 2);
            ctx.lineTo(unit.x + size, unit.y - size - 2);
            ctx.strokeStyle = '#FFF0A5';
            ctx.stroke();

            var livePercent = unit.lives / unit.maxLives;

            ctx.beginPath();
            ctx.moveTo(unit.x - size, unit.y - size - 2);
            ctx.lineTo(unit.x - size + livePercent * size * 2, unit.y - size - 2);
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