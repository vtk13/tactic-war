define(['restrict.js', 'db.js'], function(restrict, db) {
    function edit(req, res)
    {
        var unitId = req.params.unit_id;
        var tacticId = req.body.tactic_id;
        db.query("UPDATE tw_cohort_units JOIN tw_cohorts USING(cohort_id) SET tactic_id=? WHERE unit_id=? AND user_id=?",
            [tacticId, unitId, req.session.user.id], function(err, info) {
                res.end(info.affectedRows.toString());
            });
    };

    return function init(app) {
        app.post('/unit/:unit_id([0-9]+)/edit', restrict('auth'), edit);
    };
});