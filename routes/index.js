
module.exports = function(db){

	function findEvent(id,cb){
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
	this.index = function(req, res){
	    /* Select 'contact' collection */
	    db.collection('events', function(err, events) {
	    	events.find({}).toArray(function(err,items){
	    		res.render('index', { title: '活動狂' ,events:items,dateFormat:dateformatHelper} );
	    	});
		});
	}; 

	this.event = function(req, res){	
		findEvent(req.params.id,function(events,item){
			res.render('event', { title: '活動狂' ,event:item} );
		});
	}; 

	this.admin = {
		_new:function(req, res){	
			res.render('admin/new', {
				title: '建立活動 ' ,
				dateFormat:dateformatHelper
			});
		}, 
		create:function(req, res){
		    /* Select 'contact' collection */
		    db.collection('events', function(err, events) {		
		    	var item = {};
				item.name = req.body.name;
				item.startDate = new Date(req.body.startDate);
				item.endDate = new Date(req.body.endDate);
				events.save(item);
				res.redirect('/admin/editBackground/'+item._id);
		    });
		},
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
		delete:function(req, res){	
			findEvent(req.params.id,function(events,item){
				events.remove({_id:new db.ObjectId(req.params.id)});
				res.redirect('/Admin'); 
			});
	 	},
	 	update:function(req, res){	
			findEvent(req.params.id,function(events,item){
				item.name = req.body.name;
				item.startDate = new Date(req.body.startDate);
				item.endDate = new Date(req.body.endDate);
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
	 	updateBackground:function(req,res){
			findEvent(req.params.id,function(events,item){
				item.background = req.body.background;
				events.save(item);
				res.redirect('/admin/editSeat/'+item._id); 
			});
	 	},
	 	editBackgroundInner:function(req,res){
	 		findEvent(req.params.id,function(events,item){
				res.render('admin/editBackgroundInner', {
					title: '編輯活動地圖 [' + item.name + ']' ,
					event:item
				});
			});	
	 	},
	 	editSeat:function(req, res){	
			findEvent(req.params.id,function(events,item){
				res.render('admin/editSeat', {
					title: '[' + item.name + '] 編輯活動座位 ' ,
					event:item,
					nav:2,
				});
			});
	 	},
	 	editSeatInner: function(req, res){
			findEvent(req.params.id,function(events,item){
				res.render('admin/editSeatInner', {
					title: '[' + item.name + '] 編輯活動座位' ,
					event:item,
					nav:2,
				});
			});
	 	},
	 	updateSeat:function(req,res){
			findEvent(req.params.id,function(events,item){
				item.seat = req.body.seat;
				var $ = require("jQuery"),ids = [];
				$(item.seat).find("ellipse,rect").each(function(){
					ids.push(this.id);
				});
				item.seatIds = ids;
				events.save(item);
				res.redirect('/'); 
			});
	 	} 	
	}; 



	this.api = {
		getUserName: function(req,res){
		    /* Select 'contact' collection */
		    db.collection('users', function(err, users) {
		    	users.find({fbuid:req.params.fbuid}).toArray(function(err,items){
		    		if( items.length == 0 ){
		    			res.send({isSuccess:false,data:null});
		    		}else{
		    			res.send({isSuccess:true,data:items[0].name});
		    		}
		    	});
			});
		},
		setUserName: function(req,res){
		    /* Select 'contact' collection */
		    db.collection('users', function(err, users) {
		    	users.find({fbuid:req.params.fbuid}).toArray(function(err,items){
		    		if( items.length == 0 ){
		    			var obj = { fbuid:req.params.fbuid , name : req.body.name};
		    			users.save(obj);
		    			res.send({isSuccess:true,data:obj.name});
		    		}else{
		    			res.send({isSuccess:false,data:null});
		    		}
		    	});
		    	db.close();
			});
		},
		getUserSeats:function (req,res){
		    /* Select 'contact' collection */
		    db.collection('user_seat', function(err, user_seats) {
		    	//user_seats.remove({});
		    	user_seats.find({
		    		eventId: req.params.eventId
		    	}).toArray(function(err,items){
	    			res.send({isSuccess:true,data:items});
		    	});
			});
		},
		doOrderSeat:function (req,res){
		    /* Select 'contact' collection */
		    db.collection('user_seat', function(err, user_seats) {
		    	//user_seats.remove({});
		    	user_seats.find({
		    		fbuid:req.body.fbuid,
		    		eventId: req.body.eventId
		    	}).toArray(function(err,items){
		    		if( items.length == 0 ){
		    			var obj = { 
		    				fbuid:req.body.fbuid , 
		    				name : req.body.name, 
		    				eventId :req.body.eventId,
		    				seatId: req.body.seatId
		    			};
		    			user_seats.save(obj);
		    			console.dir(obj);
		    			res.send({isSuccess:true,data:obj.name});
		    		}else{
		    			var obj = items[0];
		    			obj.seatId =  req.body.seatId;
		    			user_seats.save(obj);
		    			res.send({isSuccess:true,data:obj.name});
		    		}
		    	});
			});
		}
	}; 

	return this;	
};