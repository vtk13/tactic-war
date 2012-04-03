define(['db.js'], function(db) {
    function CodeManager()
    {

    };

    CodeManager.prototype.load = function(id, userId, cb)
    {
        db.query("SELECT * FROM tw_cohort_code WHERE code_id=? AND user_id=?", [id, userId],
            function(err, result, fields) {
                if (err) {
                    cb(err);
                } else if (result.length == 0) {
                    cb(new Error('No such code ' + id));
                } else {
                    cb(null, result[0]);
                }
            });
    }

    CodeManager.prototype.loadTactics = function(userId, cb)
    {
        db.query("SELECT * FROM tw_cohort_code WHERE user_id=? AND code_type='tactic'", [userId],
            function(err, result, fields) {
                var _res = [];
                for (var i in result) {
                    _res.push({
                        id  : result[i].code_id,
                        name: result[i].code_name,
                        src : result[i].code_src
                    });
                }
                cb(err, _res);
            });
    }

    return new CodeManager();
});