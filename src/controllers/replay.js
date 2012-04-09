define(['restrict.js', 'db.js'], function(restrict, db) {
    function view(req, res) {
        var replayId = req.params.replay_id;
        res.render('replay', {
            replayId: replayId
        });
    };

    function load(req, res)
    {
        var replayId = req.params.replay_id;
        db.query(
            'SELECT b.*, p1.publish_name publish1_name, p1.publish_rate publish1_rate,' +
                       ' p2.publish_name publish2_name, p2.publish_rate publish2_rate' +
             ' FROM tw_battles b' +
                  ' JOIN tw_publishes p1 ON b.publish1_id=p1.publish_id' +
                  ' JOIN tw_publishes p2 ON b.publish2_id=p2.publish_id' +
            ' WHERE b.battle_id=?', [replayId], function(err, result, fields) {
            res.json(result[0]);
        });
    }

    return function init(app) {
        app.get('/replay/:replay_id([0-9]+)', view);
        app.get('/replay/:replay_id([0-9]+)/load', load);
    };
});