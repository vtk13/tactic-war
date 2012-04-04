define(['db.js', 'game-entities/managers/code-manager.js'], function(db, codeManager) {

    return {
        list: function(userId, cb)
        {
            db.query('SELECT * FROM tw_publishes WHERE user_id=? ORDER BY publish_active DESC, publish_date DESC', [userId], function(error, result, fields) {
                var publishes = [];
                if (!error) {
                    for (var i in result) {
                        publishes.push({
                            id:         result[i].publish_id,
                            userId:     result[i].user_id,
                            cohortId:   result[i].cohort_id,
                            name:       result[i].publish_name,
                            active:     result[i].publish_active,
                            date:       result[i].publish_date,
                            rate:       result[i].publish_rate
                        });
                    }
                }
                cb(error, publishes);
            });
        },

        load: function(publishId, cb)
        {
            db.query('SELECT * FROM tw_publishes WHERE publish_id=?', [publishId], function(error, result, fields) {
                var publish = null;
                if (!error && result.length == 1) {
                    publish = {
                        id:         result[0].publish_id,
                        userId:     result[0].user_id,
                        cohortId:   result[0].cohort_id,
                        rulesId:    result[0].rules_id,
                        name:       result[0].publish_name,
                        active:     result[0].publish_active,
                        date:       result[0].publish_date,
                        rate:       parseFloat(result[0].publish_rate),
                        strategy:   result[0].publish_strategy ? JSON.parse(result[0].publish_strategy) : null,
                        units:      result[0].publish_units ? JSON.parse(result[0].publish_units) : null,
                        tactics:    result[0].publish_tactics ? JSON.parse(result[0].publish_tactics) : null
                    };
                }
                cb(error, publish);
            });
        },

        setout: function(cohort, cb) {
            db.query('INSERT INTO tw_publishes(user_id, cohort_id, rules_id, publish_name, publish_date, publish_units) VALUES (?, ?, ?, ?, NOW(), ?)',
                [cohort.userId, cohort.id, cohort.rulesId, cohort.name, JSON.stringify(cohort.units)], function(error, info) {
                    if (error) {
                        cb(error);
                    } else {
                        var publishId = info.insertId;
                        var waitActions = 3;

                        if (cohort.strategyId) {
                            codeManager.load(cohort.strategyId, cohort.userId, function(error, code) {
                                if (error) {
                                    cb(error);
                                } else {
                                    db.query("UPDATE tw_publishes SET publish_strategy=? WHERE publish_id=?",
                                        [JSON.stringify(code), publishId]);
                                    if (--waitActions == 0) {
                                        cb();
                                    }
                                }
                            });
                        } else {
                            waitActions--;
                        }

                        db.query("UPDATE tw_publishes SET publish_active=0 WHERE cohort_id=? AND publish_id <> ?",
                            [cohort.id, publishId], function(error) {
                                if (error) {
                                    cb(error);
                                } else {
                                    if (--waitActions == 0) {
                                        cb();
                                    }
                                }
                            }
                        );

                        codeManager.loadTactics(cohort.userId, function(error, tactics) {
                            if (error) {
                                cb(error);
                            } else {
                                db.query("UPDATE tw_publishes SET publish_tactics=? WHERE publish_id=?",
                                    [JSON.stringify(tactics), publishId]);
                                if (--waitActions == 0) {
                                    cb();
                                }
                            }
                        });
                    }
                }
            );
        }
    };
});