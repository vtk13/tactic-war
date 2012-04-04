define(['restrict.js', 'db.js', 'game-entities/rules/list.js',
        'game-entities/managers/cohort-manager.js',
        'game-entities/managers/code-manager.js',
        'game-entities/managers/publish-manager.js'], function(restrict, db, rulesList, cohortManager, codeManager,
            publishManager) {
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
        cohortManager.load(id, userId, function(error, cohort) {
            if (error) {
                console.log(error);
                res.end('error');
            } else {
                res.json(cohort);
            }
        });
    };

    function setout(req, res)
    {
        var id = req.params.cohort_id, userId = req.session.user.id;
        cohortManager.load(id, userId, function(error, cohort) {
            if (error) {
                console.log(error);
                res.end('error');
            } else {
                publishManager.setout(cohort, function(error) {
                    if (error) {
                        console.log(error);
                        res.end('error');
                    } else {
                        req.session.message = 'Cohort published';
                        res.redirect('back');
                    }
                });
            }
        });
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