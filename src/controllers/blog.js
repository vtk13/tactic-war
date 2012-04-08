define([], function() {
    function helloWorld(req, res)
    {
        res.render('blog/hello-world');
    };

    function debug(req, res)
    {
        res.render('blog/debug');
    };

    function api(req, res)
    {
        res.render('blog/api');
    };

    function units(req, res)
    {
        res.render('blog/units');
    };

    return function init(app) {
        app.get('/blog/hello-world', helloWorld);
        app.get('/blog/debug', debug);
        app.get('/blog/api', api);
        app.get('/blog/units', units);
    };
});