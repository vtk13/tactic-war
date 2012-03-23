/**
 * possible theme http://kuler.adobe.com/#themeID/24198
 * 468966
 * FFF0A5
 * FFB03B
 * B64926
 * 8E2800
 */
define(['game-entities/footman.js'], function(Footman) {
    function Player(cohort1, cohort2, canvas)
    {
        this.cohort1 = cohort1;
        this.cohort2 = cohort2;
        this.c2d = canvas.getContext('2d');
    };

    Player.prototype.draw = function()
    {
        var ctx = this.c2d;
        ctx.fillStyle = '#468966';
        ctx.fillRect(0, 0, 600, 300);

        var units = [];

        for (var i in this.cohort1.units) {
            units.push(this.cohort1.units[i]);
        }
        for (var i in this.cohort2.units) {
            units.push(this.cohort2.units[i]);
        }
        units.sort(function(a, b) {
            if (a.y < b.y) return -1;
            if (a.y > b.y) return 1;
            return 0;
        });

        for (var i in units) {
            if (units[i] instanceof Footman) {
                this.drawFootman(units[i]);
            }
        }
    };

    Player.prototype.drawFootman = function(unit)
    {
        var ctx = this.c2d;
        var size = 7;
        ctx.fillStyle = '#B64926';
        ctx.beginPath();
        ctx.arc(unit.x, unit.y, size, 0, Math.PI*2, true);
        ctx.closePath();
        ctx.fill();

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

        var livePercent = unit.lives / unit.rules.footmanLives();

        ctx.beginPath();
        ctx.moveTo(unit.x - size, unit.y - size - 2);
        ctx.lineTo(unit.x - size + livePercent * size * 2, unit.y - size - 2);
        ctx.strokeStyle = '#8E2800';
        ctx.stroke();
    }

    return Player;
});