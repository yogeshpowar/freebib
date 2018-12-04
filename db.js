var MongoClient = require('mongodb').MongoClient;

var state = {
  db: null,
};

exports.connect = function(url, done) {
  if (state.db) {
      console.log("db: already connected");
      return done();
  }

  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) {
        console.log("db: " + err);
        return done(err);
    }
    state.db = db.db("freebib");;
    done();
  });
};

exports.get = function() {
  return state.db;
};

exports.getCollection = function(name) {
    return state.db.collection(name);
};

exports.close = function(done) {
  if (state.db) {
    state.db.close(function(err, result) {
      state.db = null;
      state.mode = null;
      done(err);
    });
  }
}
