
function findEvent(id,cb){
	var db = require("../db");

	db.open(function(err) {
		if (err) throw err;
	    /* Select 'contact' collection */
	    db.collection('events', function(err, events) {
	    	/*
	    	events.save(
	    		{
	    			name:"test",
	    			startDate:new Date("2012/9/1"),
	    			endDate:new Date("2012/9/5")
	    		}
	    	);*/
	    	events.find({_id:new db.ObjectId(id)}).toArray(function(err,items){	
	    		if(items.length == 0 )    {
	    			throw "event not found";
	    		}
	    		cb(events,items[0]);
	    		db.close();	
	    	});	    	

	   	});	
	});
}

var dateformat = require('dateformat')
function dateformatHelper(str){
	return dateformat(str,"yyyy/mm/dd HH:MM:ss");
}
/*
 * GET home page.
 */
exports.index = function(req, res){
	var db = require("../db");
	db.open(function(err) {
		if (err) throw err;
	    /* Select 'contact' collection */
	    db.collection('events', function(err, events) {
	    	events.find({}).toArray(function(err,items){
	    		res.render('index', { title: '活動狂' ,events:items,dateFormat:dateformatHelper} );
	    	});
	    	db.close();
		});
	});

  	
}; 

exports.event = function(req, res){	
	findEvent(req.params.id,function(events,item){
		res.render('event', { title: '活動狂' ,events:item,nav:0} );
	});
}; 

exports.admin = {
	edit:function(req, res){	
		findEvent(req.params.id,function(events,item){
			res.render('admin/edit', {
				title: '編輯活動 [' + item.name + ']' ,
				event:item,
				nav:0,
				dateFormat:dateformatHelper
			});
		});
 	},
 	update:function(req, res){	
		findEvent(req.params.id,function(events,item){
			item.name = req.body.name;
			item.startDate = new Date(req.body.startDate);
			item.endDate = new Date(req.body.endDate);
			console.dir(item);
			events.save(item);
			res.redirect('/'); 
		});
 	},
 	editBackground:function(req, res){	
		findEvent(req.params.id,function(events,item){
			res.render('admin/editBackground', {
				title: '編輯活動 [' + item.name + ']' ,
				event:item,
				nav:1,
			});
		});
 	},
 	editSeat:function(req, res){	
		findEvent(req.params.id,function(events,item){
			res.render('admin/editSeat', {
				title: '編輯活動 [' + item.name + ']' ,
				event:item,
				nav:2,
			});
		});
 	}
}; 