var express = require('express');
var router = express.Router();
var passport = require('passport');

router.get('/version', function(req, res, next) {
    var version = require('../version.json');
    return res.send(version);
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
    res.render('index');
});

router.get('/upload', function(req, res, next) {
    res.render('upload');
});

/* GET home page. */
router.get('/dashboard', require('connect-ensure-login').ensureLoggedIn(),
    function(req, res, next) {
  res.render('dashboard');
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
