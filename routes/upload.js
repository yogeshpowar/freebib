var express = require('express');
var router = express.Router();
var db = require('../db');
var fs = require('graceful-fs');
var multer = require('multer');
var csv = require('csv-to-json');
var helper = require('./helper');

//router.all('*');

var storage = multer.diskStorage({
    //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, datetimestamp + '.' + file.originalname.split('.') [
                file.originalname.split('.').length -1
        ]);
    }
});

var csvTojson = function(input, cb) {
    var error = [];
    var csvFilePath = input;
    var obj = { filename: "./"+input };

    csv.parse(obj, function(err, arr){
        if (err) {
            return cb(err, error);
        }
        return cb(null, arr.filter(e => e.name));
    });
};

var upload = multer({ storage: storage }).single('file');

var uploadArr = function(arr, i, cb) {
    if (arr.length == i) {
        return cb();
    }
    arr[i].bulk = true;
    helper.update(arr[i], function(){
        uploadArr(arr, ++i, cb);
    });
};

router.post('/', function (req, res, next) {
    upload(req, res, function(err) {
        if (err){
            console.log(err);
            res.json({ error_code: 1, err_desc: err });
            return;
        }
        csvTojson(req.file.path, function(err, arr) {
            if (err) {
                return res.json({error_code: 1, err_desc: err});
            }
            uploadArr(arr, 0, function() {
                return res.json({error_code: 0, err_desc: null});
            });
        });
    });
});

module.exports = router;
