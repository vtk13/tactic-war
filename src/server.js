var requirejs = require('requirejs');
var express = require('express');
var app = express.createServer();
var i18n = require('i18n');

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
    app.use(express.static(__dirname));
});

app.get('/', function(req, res) {
    res.render('index');
});

app.get('/sandbox', function(req, res) {
    res.render('sandbox');
});

app.get('/mypage', function(req, res) {
    res.render('mypage');
});

app.get('/cohort/create', function(req, res) {
    res.render('cohort/create');
});

app.get('/cohort/:cohort_id([0-9]+)/edit', function(req, res) {
    res.render('cohort/edit');
});

app.get('/cohort/:cohort_id([0-9]+)/setout', function(req, res) {
    res.redirect('back');
});

app.get('/cohort/:cohort_id([0-9]+)/replays', function(req, res) {
    res.render('cohort/replays');
});

app.get('/setout/:cohort_id([0-9]+)/replays', function(req, res) {
    res.render('setouts/replays');
});

app.get('/replay/:replay_id([0-9]+)', function(req, res) {
    res.render('replay');
});

app.listen(3000);
