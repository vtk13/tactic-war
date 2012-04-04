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

        db.query('SELECT b.*, p1.publish_name publish1_name, p2.publish_name publish2_name ' +
                   'FROM tw_battles b ' +
                        'JOIN tw_publishes p1 ON b.publish1_id=p1.publish_id ' +
                        'JOIN tw_publishes p2 ON b.publish2_id=p2.publish_id ' +
               'ORDER BY battle_time DESC ' +
                  'LIMIT 10', function(err, result) {
            for (var i in result) {
                data.replays.push({
                    id: result[i].battle_id,
                    time: result[i].battle_time,
                    result: result[i].battle_result,
                    publish1Name: result[i].publish1_name,
                    publish2Name: result[i].publish2_name
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