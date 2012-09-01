
/*
 * GET event page.
 */
exports.event = function(req, res){
	//var db = require("../db");
//	//db.open(function(err) {
//	//	if (err) throw err;
//	//    /* Select 'contact' collection */
//	//    db.collection('events', function(err, events) {
//	//    	/*
//	//    	events.save(
//	//    		{
//	//    			name:"test",
//	//    			startDate:new Date("2012/9/1"),
//	//    			endDate:new Date("2012/9/5")
//	//    		}
//	//    	);*/
//
	//    	events.find({}).toArray(function(err,items){
	//    		res.render('index', { title: 'Event Link Home' ,events:items} );
	//    	});
	//    	db.close();
	//	});
	//});
	res.render('event', { title: 'Event'} );
  	
}; 