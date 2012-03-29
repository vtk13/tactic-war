define(['db.js', 'i18n'], function(mysql, i18n) {
    function login(req, res) {
        if (req.body.email && req.body.password) {
            mysql.query("SELECT user_id, user_email, user_password = MD5(?) AS checked FROM tw_users WHERE user_email LIKE ?",
                [req.body.password, req.body.email],
                function(err, result, fields) {
                    if (err) {
                        res.end('error');
                        throw err;
                    }
                    if (result.length == 0) { // register
                        mysql.query('INSERT INTO tw_users(user_email, user_password) VALUES(?, MD5(?))',
                            [req.body.email, req.body.password], function(err, info) {
                                req.session.message = i18n.__('registration-success');
                                req.session.user = {
                                    id: info.insertId,
                                    email: req.body.email
                                };
                                res.redirect('/mypage');
                            });
                    } else if (result[0].checked == false) {
                        req.session.error = i18n.__('wrong-password');
                        res.redirect('back');
                    } else {
                        req.session.user = {
                            id: result[0].user_id,
                            email: result[0].user_email
                        };
                        res.redirect('/mypage');
                    }
                }
            );
        } else {
            res.redirect('/');
        }
    }

    function logout(req, res) {
        req.session.destroy();
        res.redirect('/');
    }

    return function init(app) {
        app.post('/login', login);
        app.get('/logout', logout);

        app.dynamicHelpers({
            user: function(req, res) {
                return req.session.user;
            }
        });
    };
});