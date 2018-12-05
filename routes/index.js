var express = require('express');
var router = express.Router();
var passport = require('passport');
var version = require('../version.json');

router.get('/version', function(req, res, next) {
    return res.send(version);
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { version: version } );
});

router.get('/login', function(req, res, next) {
    res.render('index', { version: version });
});

router.get('/upload', require('connect-ensure-login').ensureLoggedIn(),
    function(req, res, next) {
    res.render('upload', { user: req.user.username, version: version });
});

/* GET home page. */
router.get('/dashboard', require('connect-ensure-login').ensureLoggedIn(),
    function(req, res, next) {
        console.log(req.user);
  res.render('dashboard', { user: req.user.username, version: version });
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
