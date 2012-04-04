requirejs(['game-runner/player.js', 'lib/events.js'], function(Player, EventEmitter) {
    $.getJSON('/replay/' + $('input[name=replayId]').val() + '/load', function(replay) {
        var logger = {
            replay: JSON.parse(replay.battle_replay),
            on: EventEmitter.prototype.on,
            emit: EventEmitter.prototype.emit,
            init: function() {
                this.step();
            },
            step : function() {
                var data = this.replay.shift();
                if (data) {
                    this.emit('change', data);
                    return true;
                } else {
                    return false;
                }
            }
        };
        var player = new Player(logger, $('#field').get(0));
        var interval = setInterval(function() {
            if (logger.step() == false) {
                clearInterval(interval);
            }
        }, 200);
    });
});
