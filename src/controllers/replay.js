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
        db.query('SELECT * FROM tw_battles WHERE battle_id=?', [replayId], function(err, result, fields) {
            res.json(result[0]);
        });
    }

    return function init(app) {
        app.get('/replay/:replay_id([0-9]+)', view);
        app.get('/replay/:replay_id([0-9]+)/load', load);
    };
});