var requirejs = require('requirejs');

requirejs(['express', 'i18n',
        'controllers/user.js',
        'controllers/cohort.js',
        'controllers/code.js',
        'controllers/unit.js'], function(express, i18n, user, cohort, code, unit) {
    process.addListener('uncaughtException', function(err) {
        console.log('Uncaught exception: ' + err);
        console.trace();
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

    app.get('/', function(req, res) {
        res.render('index');
    });

    user(app);

    app.get('/sandbox', function(req, res) {
        res.render('sandbox');
    });

    app.get('/mypage', function(req, res) {
        res.render('mypage');
    });

    cohort(app);
    code(app);
    unit(app);

    app.get('/setout/:cohort_id([0-9]+)/replays', function(req, res) {
        res.render('setouts/replays');
    });

    app.get('/replay/:replay_id([0-9]+)', function(req, res) {
        res.render('replay');
    });

    app.get('/help/api', function(req, res) {
        res.render('help/api');
    });

    app.listen(3000);
});
