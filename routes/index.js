var express = require('express');
var router = express.Router();

router.get('/version', function(req, res, next) {
    var version = require('../version.json');
    return res.send(version);
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});



module.exports = router;
