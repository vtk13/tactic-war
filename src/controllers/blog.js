define([], function() {
    function helloWorld(req, res)
    {
        res.render('blog/hello-world');
    };

    function debug(req, res)
    {
        res.render('blog/debug');
    };

    return function init(app) {
        app.get('/blog/hello-world', helloWorld);
        app.get('/blog/debug', debug);
    };
});