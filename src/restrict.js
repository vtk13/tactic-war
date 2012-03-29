define(['i18n'], function(i18n) {
    function checkLogged(req, res, next)
    {
        if (!req.session.user) {
            req.session.error = i18n.__('login-to-view');
            res.redirect('/');
        } else {
            next();
        }
    };

    return function(type)
    {
        switch (type) {
            case 'auth':
                return checkLogged;
        }
    };
});