requirejs(['game-runner/player.js', 'lib/events.js'], function(Player, EventEmitter) {
    $.getJSON('/replay/' + $('input[name=replayId]').val() + '/load', function(replay) {
        console.log(replay);
        $('.publish1 .name').text(replay.publish1_name);
        $('.publish1 .rate').text(replay.publish1_rate);
        if (replay.publish1_id == replay.winner_id) {
            $('.publish1 .winner').show();
        }

        $('.publish2 .name').text(replay.publish2_name);
        $('.publish2 .rate').text(replay.publish2_rate);
        if (replay.publish2_id == replay.winner_id) {
            $('.publish2 .winner').show();
        }


        var logger = {
            replay: JSON.parse(replay.battle_replay),
            on: EventEmitter.prototype.on,
            emit: EventEmitter.prototype.emit,
            init: function() {
                this.step();
            },
            step: function() {
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
