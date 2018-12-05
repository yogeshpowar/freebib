var express = require('express');
var router = express.Router();
var db = require('../db');
var helper = require('./helper');

router.all('*', require('connect-ensure-login').ensureLoggedIn(),
function(req, res, next) {
    next();
});

router.post('/create', function(req, res, next) {
    var collection = db.getCollection('bibs');
    var keys = [ "bibCategoryId", "bib", "name", "phone",
                 "email", "age", "bloodGroup"];
    var i = req.body;
    var query = {};
    var collection = db.getCollection('bibs');

    for (var k in keys) {
        query[keys[k]] = i[keys[k]];
    };
    query["isCollected"] = false;

    collection.updateOne({ bib: query.bib }, {$set: query}, { upsert: true},
    function(err, resp) {
        if (err) throw(err);

        return res.send({ success: true});
    });
});
router.get('/list', function(req, res, next) {
    var collection = db.getCollection('bibs');
    var query = {};

    if (!req.query.name && !req.query.bib) {
        return res.send([]);
    }

    if (req.query.name) {
        query.name = { $regex: req.query.name , $options: 'is' };
    } else if (Number(req.query.bib)) {
        query.bib = Number(req.query.bib);
    } else {
        return res.send([]);
    }

    collection.find(query).toArray(function (err, docs ) {
        if (err) throw err;
        return res.send(docs);
    });
});
router.post('/update', function(req, res, next) {
    req.body.updatedBy = req.user.username;
    helper.update(req.body, function(ret) {
        return res.send(ret);
    });
});
module.exports = router;
