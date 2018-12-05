var db = require('../db');

var update = function(i, cb) {
    var collection = db.getCollection('bibs');
    var keys = [ "bibCategoryId", "bib", "name", "phone",
                 "email", "age", "bloodGroup", "collectedTs", "updatedBy"];
    var keys1 = [ "collectedByName", "collectedByPhone", "collectedByEmail" ];

    var query = {};
    var collection = db.getCollection('bibs');
    var updateTs = false;

    for (var k in keys) {
        query[keys[k]] = i[keys[k]];
    };

    for (k in keys1) {
        if (i[keys1[k]]) {
            query[keys1[k]] = i[keys1[k]];
            updateTs = true;
        }
    };

    if (updateTs && !query["collectedTs"]) {
        query["collectedTs"] = new Date().toISOString();
        query["isCollected"] = true;
    } else if (updateTs) {
        /* Do not over-write isCollected */
        query["isCollected"] = true;
    } else {
        query["isCollected"] = false;
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
        };

        return cb({ success: true});
    });
};
exports.update = update;
