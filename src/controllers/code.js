define(['restrict.js', 'db.js'], function(restrict, db) {
    function load(req, res)
    {
        db.query("SELECT * FROM tw_cohort_code WHERE user_id=?", [req.session.user.id],
            function(err, result, fields) {
                var _res = {tactic: [], strategy: []};
                for (var i in result) {
                    var type = result[i].code_type;
                    _res[type].push({
                        id  : result[i].code_id,
                        name: result[i].code_name,
                        src : result[i].code_src
                    });
                }
                res.json(_res);
            });
    };

    function create(req, res)
    {
        var type = req.body.type;
        if (['tactic', 'strategy'].indexOf(type) == -1) {
            req.end('wrong type');
        }
        var name = req.body.name;
        var src = req.body.src;
        if (!name && !src) {
            res.end();
        } else {
            db.query("INSERT INTO tw_cohort_code(user_id, code_type, code_name, code_src)" +
                "VALUES(?,?,?,?)", [req.session.user.id, type, name, src], function(err, info) {
                res.end(info.insertId.toString());
            });
        }
    };

    function edit(req, res)
    {
        var codeId = req.params.code_id;
        var name = req.body.name;
        var src = req.body.src;
        db.query("UPDATE tw_cohort_code SET code_name=?, code_src=? WHERE code_id=? AND user_id=?",
            [name, src, codeId, req.session.user.id], function(err, info) {
            res.end(info.affectedRows.toString());
        });
    };

    return function init(app) {
        app.get('/code/load', restrict('auth'), load);
        app.post('/code/create', restrict('auth'), create);
        app.post('/code/:code_id([0-9]+)/edit', restrict('auth'), edit);
    };
});