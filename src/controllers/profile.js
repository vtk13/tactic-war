define(['restrict.js', 'db.js',
        'game-entities/managers/publish-manager.js'], function(restrict, db, publishManager) {
    function mypage(req, res)
    {
        var data = {
            cohorts: [],
            publishes: []
        };
        var waitActions = 2;

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
    };

    return function init(app) {
        app.get('/mypage', restrict('auth'), mypage);
    };
});