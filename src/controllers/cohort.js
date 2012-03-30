define(['restrict.js', 'db.js', 'game-entities/rules/list.js'], function(restrict, db, rulesList) {
    function saveCohort(userId, rulesId, name, units, cb)
    {
        db.query("INSERT INTO tw_cohorts(user_id, rules_id, cohort_name)" +
            "VALUES(?, ?, ?)", [userId, rulesId, name], function(err, info) {
            if (err) {
                cb(err, null);
            } else {
                var id = info.insertId;
                var queriesDone = 0, _err;
                for (var i in units) {
                    db.query('INSERT INTO tw_cohort_units(cohort_id, unit_type, unit_order)' +
                        'VALUES(?, ?, ?)', [id, units[i], i], function(err, info) {
                        queriesDone++;
                        if (err) {
                            _err = err;
                        }
                        if (queriesDone == units.length) {
                            cb(_err, id);
                        }
                    });
                }
            }
        });
    };

    function handleCreateCohortRequest(data, cb)
    {
        if (!data || !rulesList[data.category] || !data.name || !data.units || !data.units.length) {
            cb(new Error('nodata'));
            return;
        }
        var rules = rulesList[data.category];
        var avUnits = rules.availableUnits();
        var units = [], cost;
        for (var i in data.units) {
            var unit = data.units[i];
            if (avUnits[unit]) {
                units.push(unit);
                cost += avUnits[unit].cost;
            }
        }
        if (cost > rules.maxCost()) {
            cb(new Error('cheater?'));
            return;
        }
        saveCohort(data.userId, data.category, data.name, units, cb);
    };

    function create(req, res)
    {
        res.render('cohort/create', {
            rules: rulesList
        });
    };

    function doCreate(req, res)
    {
        req.body.userId = req.session.user.id;
        handleCreateCohortRequest(req.body, function(err, id) {
            if (err) {
                req.session.error = err.message;
                res.redirect('back');
            } else {
                res.redirect('/cohort/' + id + '/edit');
            }
        });
    };

    function edit(req, res)
    {
        var data = {
            cohort: {
                id: req.params.cohort_id
            },
            cohorts: []
        };
        db.query("SELECT * FROM tw_cohorts WHERE user_id=?", [req.session.user.id], function(err, result, fields) {
            data.cohorts = result;
            res.render('cohort/edit', data);
        });
    };

    function doEdit(req, res)
    {
        var cohortId = req.params.cohort_id;
        var strategyId = req.body.strategy_id;
        db.query("UPDATE tw_cohorts SET strategy_id=? WHERE cohort_id=? AND user_id=?",
            [strategyId, cohortId, req.session.user.id], function(err, info) {
                res.end(info.affectedRows.toString());
            });
    };

    function load(req, res)
    {
        var id = req.params.cohort_id, userId = req.session.user.id;
        db.query('SELECT * FROM tw_cohorts WHERE cohort_id=? AND user_id=?', [id, userId],
            function(err, result, fields) {
                if (result && result.length == 1) {
                    var cohort = {
                        id: result[0].cohort_id,
                        rulesId: result[0].rules_id,
                        name: result[0].cohort_name,
                        strategyId: result[0].strategy_id,
                        units: []
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
                                res.json(cohort);
                            } else {
                                console.log('No units for cohort ' + id);
                                res.json({});
                            }
                        });
                } else {
                    console.log('No data for cohort ' + id + ', user ' + userId);
                    res.json({});
                }
            });
    };

    function setout(req, res)
    {
        res.redirect('back');
    };

    function replays(req, res)
    {
        res.render('cohort/replays');
    };

    return function init(app) {
        app.get('/cohort/create', restrict('auth'), create);
        app.post('/cohort/create', restrict('auth'), doCreate);
        app.get('/cohort/:cohort_id([0-9]+)/edit', restrict('auth'), edit);
        app.post('/cohort/:cohort_id([0-9]+)/edit', restrict('auth'), doEdit);
        app.get('/cohort/:cohort_id([0-9]+)/load', restrict('auth'), load);
        app.get('/cohort/:cohort_id([0-9]+)/setout', restrict('auth'), setout);
        app.get('/cohort/:cohort_id([0-9]+)/replays', restrict('auth'), replays);
    };
});