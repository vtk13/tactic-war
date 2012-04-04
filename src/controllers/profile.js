define(['restrict.js', 'db.js',
        'game-entities/managers/publish-manager.js'], function(restrict, db, publishManager) {
    function mypage(req, res)
    {
        var data = {
            cohorts: [],
            publishes: [],
            replays: []
        };
        var waitActions = 3;

        db.query("SELECT * FROM tw_cohorts WHERE user_id=?", [req.session.user.id], function(err, result, fields) {
            data.cohorts = result;
            if (--waitActions == 0) {
                res.render('mypage', data);
            }
        });

        publishManager.list(req.session.user.id, function(error, publishes) {
            data.publishes = publishes;
            if (--waitActions == 0) {
                res.render('mypage', data);
            }
        });

        db.query('SELECT * FROM tw_battles ORDER BY battle_time DESC LIMIT 10', function(err, result) {
            for (var i in result) {
                data.replays.push({
                    id: result[i].battle_id,
                    time: result[i].battle_time
                });
            }
            if (--waitActions == 0) {
                res.render('mypage', data);
            }
        });
    };

    return function init(app) {
        app.get('/mypage', restrict('auth'), mypage);
    };
});