define(['restrict.js', 'db.js',
        'game-entities/managers/replay-manager.js'], function(restrict, db, replyaManager) {
    function hide(req, res)
    {
        db.query("UPDATE tw_publishes SET publish_active=0 WHERE publish_id=? AND user_id=?",
            [req.params.publish_id, req.session.user.id], function(err, info) {
                res.redirect('back');
            }
        );
    };

    function replays(req, res) {
        replyaManager.list(req.params.publish_id, function(replays) {
            res.render('setouts/replays', {
                replays: replays
            });
        });
    };

    return function init(app) {
        app.get('/setout/:publish_id([0-9]+)/hide', restrict('auth'), hide);
        app.get('/setout/:publish_id([0-9]+)/replays', restrict('auth'), replays);
    };
});