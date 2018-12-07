var express = require('express');
var router = express.Router();
var passport = require('passport');
var version = require('../version.json');
var conf = require('./conf.json');

router.get('/version', function(req, res, next) {
    return res.send(version);
});

router.get('/getMapping', function(req, res, next) {
    for (var key in conf.mapping) {
        if (!conf.mapping[key]) {
            delete(conf.mapping[key]);
        }
    }
    res.send(conf.mapping);
});

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { version: version, brand: conf.brand,
        title: conf.brand + " Login"});
});

router.get('/login', function(req, res, next) {
    res.render('index', { version: version, brand: conf.brand,
        title: conf.brand + " Login"});
});

router.get('/upload', require('connect-ensure-login').ensureLoggedIn(),
    function(req, res, next) {
    res.render('upload', { user: req.user.username, version: version ,
        brand: conf.brand, title: conf.brand + " Uploader" });
});

/* GET home page. */
router.get('/dashboard', require('connect-ensure-login').ensureLoggedIn(),
    function(req, res, next) {
  res.render('dashboard', { user: req.user.username, version: version ,
      brand: conf.brand, title: conf.brand + " dashboard" });
});

router.post('/login', passport.authenticate('local', {
    failureRedirect: '/'
}), function(req, res) {
    res.redirect('/dashboard');
});

router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

module.exports = router;
