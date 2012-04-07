var requirejs = require('requirejs');

requirejs(['express', 'i18n', 'lib/date-format.js',
        'controllers/user.js',
        'controllers/cohort.js',
        'controllers/code.js',
        'controllers/unit.js',
        'controllers/profile.js',
        'controllers/replay.js',
        'controllers/setout.js',
        'controllers/blog.js',
        'game-runner/battle-runner.js'], function(express, i18n, dateFormat, user, cohort, code, unit, profile,
                                                  replay, setout, blog, battleRunner) {
    process.addListener('uncaughtException', function(err) {
        console.log('Uncaught exception: ' + err);
        console.log(err.stack);
    });

    var app = express.createServer();

    i18n.configure({
        locales: ['en', 'ru']
    });

    app.helpers({
      __i: i18n.__,
      __n: i18n.__n
    });

    app.configure('development', function(){
        app.enable('case sensitive routes');
        app.enable('strict routing');
        app.use(i18n.init);
        app.set('views', __dirname + '/views');
        app.set('view engine', 'jade');
        app.set('view options', { layout: false });
        app.use(express.static(__dirname));
        app.use(express.bodyParser());
        app.use(express.cookieParser());
        app.use(express.session({secret: 'fqi738y4tq7'}));
    });

    // Session-persisted message middleware
    app.dynamicHelpers({
        message: function(req, res) {
            var err = req.session.error,
                msg = req.session.message;
            delete req.session.error;
            delete req.session.message;
            var message = '';
            if (msg) message = '<p class="msg">' + msg + '</p>';
            if (err) message = '<p class="msg error">' + err + '</p>';
            return message;
        }
    });

    user(app);

    app.get('/sandbox', function(req, res) {
        res.render('sandbox');
    });

    cohort(app);
    code(app);
    unit(app);
    profile(app);
    replay(app);
    setout(app);
    blog(app);

    app.get('/help/api', function(req, res) {
        res.render('help/api');
    });

    app.get('/help/units', function(req, res) {
        res.render('help/units');
    });

    app.listen(3000);
    console.log('Server started at port 3000');

    var runner = new battleRunner();
//    runner.run();
    setInterval(function() {
        runner.run();
    }, 60000);
});
