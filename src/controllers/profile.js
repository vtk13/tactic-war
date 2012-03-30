define(['restrict.js', 'db.js'], function(restrict, db) {
    function mypage(req, res)
    {
        var data = {
            cohorts: []
        };
        db.query("SELECT * FROM tw_cohorts WHERE user_id=?", [req.session.user.id], function(err, result, fields) {
            data.cohorts = result;
            res.render('mypage', data);
        });
    };

    return function init(app) {
        app.get('/mypage', restrict('auth'), mypage);
    };
});