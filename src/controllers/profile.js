define(['restrict.js', 'db.js',
        'game-entities/managers/publish-manager.js',
        'game-entities/managers/replay-manager.js'], function(restrict, db, publishManager, replyaManager) {
    function index(req, res)
    {

        replyaManager.list(null, function(replays) {
            res.render('index', {
                replays: replays
            });
        });
    };

    function mypage(req, res)
    {
        var data = {
            rate: 1200,
            cohorts: [],
            publishes: [],
            replays: []
        };
        var waitActions = 4;

        db.query("SELECT * FROM tw_users WHERE user_id=?", [req.session.user.id], function(err, result, fields) {
            data.rate = result[0].user_rate;
            if (--waitActions == 0) {
                res.render('mypage', data);
            }
        });

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

        replyaManager.list(null, function(replays) {
            data.replays = replays;
            if (--waitActions == 0) {
                res.render('mypage', data);
            }
        });
    };

    return function init(app) {
        app.get('/', index);
        app.get('/mypage', restrict('auth'), mypage);
    };
});