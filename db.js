var mongodb = require('mongodb');
	//$ = require("jQuery");

var mongodbServer = new mongodb.Server('localhost', 27017, { auto_reconnect: true, poolSize:100, safe:false});
var db = new mongodb.Db('eventlink', mongodbServer);

/* open db */
db.ObjectId  = mongodb.BSONPure.ObjectID;
module.exports = db;

/* usage */
//db.open(function(err) {
//	if (err) throw err;
//    /* Select 'contact' collection */
//    db.collection('joiners', function(err, collection) {
//        callback(db,collection);
//    });
//});
