define(['db.js'], function(db) {
    function CohortManager()
    {

    };

    CohortManager.prototype.load = function(id, userId, cb)
    {
        db.query('SELECT * FROM tw_cohorts WHERE cohort_id=? AND user_id=?', [id, userId], function(err, result, fields) {
            if (result && result.length == 1) {
                var cohort = {
                    id:         result[0].cohort_id,
                    userId:     result[0].user_id,
                    rulesId:    result[0].rules_id,
                    name:       result[0].cohort_name,
                    strategyId: result[0].strategy_id,
                    units:      []
                };
                db.query('SELECT * FROM tw_cohort_units WHERE cohort_id=? ORDER BY unit_order', [id],
                    function(err, result, fields) {
                        if (result && result.length > 0) {
                            for (var i in result) {
                                cohort['units'].push({
                                    id: result[i].unit_id,
                                    type: result[i].unit_type,
                                    tacticId: result[i].tactic_id
                                });
                            }
                            cb(null, cohort);
                        } else {
                            cb(new Error('No units for cohort ' + id));
                        }
                    });
            } else {
                cb(new Error('No data for cohort ' + id + ' user ' + userId));
            }
        });
    };

    return new CohortManager();
});