var unirest = require('unirest');
var conf = require('./conf.json');

var send = function(input, cb) {
    var query = conf.query;

    if (!input.mobile || !input.msg || !Number(input.mobile)) {
        return;
    }

    input.mobile = "" + input.mobile;

    if (input.mobile.length != 10) {
        return;
    }

    input.msg += " " + conf.signature;

    query[conf.keyMobile] = input.mobile;
    query[conf.keyMsg] = input.msg;

    unirest.get(conf.url)
    .query(query)
    .end(cb);
};
/*
send({
    mobile: "9284697124",
    msg: "Hello Runner, Your bib 5021 has been collected by Jayesh (phone | email). RunBuddy."
}, function(ret) {
});
*/

exports.send = send;

