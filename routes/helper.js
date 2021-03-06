var db = require('../db');
var sms = require('./sms');

var getStats = function(cb) {
    var collection = db.getCollection('bibs');
    collection.countDocuments({}, function(err, docs) {
        if (err) {
            return cb({ total: 0, collected: 0});
        }
        collection.countDocuments({ isCollected: true },
            function(err, collectedDocs) {
                if (err) {
                    return cb({ total: 0, collected: 0});
                }
                return cb({ total: docs, collected: collectedDocs });
        });
    });
};
exports.getStats = getStats;

var update = function(i, cb) {
    var collection = db.getCollection('bibs');
    var keys = [ "bibCategoryId", "bib", "name", "phone",
                 "email", "age", "bloodGroup", "collectedTs", "updatedBy",
                 "gender", "eventName", "tShirt", "distance", "notes" ];
    var keys1 = [ "collectedByName", "collectedByPhone", "collectedByEmail" ];

    var query = {};
    var collection = db.getCollection('bibs');
    var updateTs = false;
    var msg;

    for (var k in keys) {
        if (i[keys[k]]) {
            query[keys[k]] = i[keys[k]];
        }
    };

    if (!query.eventName) {
        query.eventName = "";
    }

    msg = query.eventName + " bib# " + query.bib + " for " +
          query.name + " has been collected  by ";

    for (k in keys1) {
        if (i[keys1[k]]) {
            query[keys1[k]] = i[keys1[k]];
            updateTs = true;
            if (i[keys1[k]] == "Self") {
                msg += " you."
            } else {
                msg += " " + i[keys1[k]];
            }
        }
    };

    if (updateTs &&
        !query["collectedTs"]) {
        query["collectedTs"] = new Date().toISOString();
        query["isCollected"] = true;
    } else if (updateTs) {
        /* Do not over-write isCollected */
        query["isCollected"] = true;
    }

    if (Number(query.bib)) {
        query.bib = Number(query.bib);
    }
    collection.updateOne({
        bib: query.bib
    }, {
        $set: query
    }, {
        upsert: true
    }, function(err, resp) {
        if (err) {
            return cb({success: false, err: err});
        }
        if (i.bulk) {
            /* Skip sending SMS for bulk upload */
            return cb({ success: true});
        }
        sms.send({
            mobile: query.phone,
            msg:  msg
        }, function(ret) { });
        return cb({ success: true});
    });
};
exports.update = update;
