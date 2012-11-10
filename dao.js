var db = require("./db"), $ = require("jQuery");

var dao, opened = false;

module.exports = dao = { 
	_db:db ,
	reg: function(name,obj){
		dao[name] = obj;
	}
};

(function /*daoinit*/ (dao,db){

	dao.reg("Event", {
		find:function(id,cb){
		    /* Select 'contact' collection */
		    db.collection('events', function(err, events) {
		    	events.find({_id:new db.ObjectId(id)}).toArray(function(err,items){	
		    		if(items.length == 0 )    {
		    			throw "event not found";
		    		}
		    		cb(events,items[0]);
		    	});	    	

		   	});	
		},
		all:function(success,fail){
			db.collection('events', function(err, events) {
		    	events.find({}).toArray(function(err,items){
		    		if (err){
		    			fail();
		    		}else{
		    			success(items);
		    		}
		    	});
			});
		},
		save:function(item,cb){
		    db.collection('events', function(err, events) {		
				events.save(item);
				if ( cb ) cb();
		    });
		}
	});

	dao.reg("User", {
		findUserBySeat:function(fbuid,eventId,success,fail){
			if($.trim(fbuid) == "" ||$.trim(eventId) == "" ){
				if(fail) fail();
			}
		    db.collection('users', function(err, userCollection) {
		    	userCollection.find({fbuid:fbuid}).toArray(function(err,users){
		    		if(err) throw err;
		    		if( users.length == 0 ){
		    			if(fail) fail();
		    			return false;
		    		}
					db.collection('user_seat', function(err, seatCollection) {
						if(err) throw err;
				    	seatCollection.find({
				    		fbuid:""+fbuid,
				    		eventId:""+eventId
				    	}).toArray(function(err,seats){
				    		if( seats.length == 0 ){
				    			success(users[0]);
				    			return true;
				    		}
				    		success({
				    			fbuid:users[0].fbuid,
				    			name:users[0].name,
				    			join:true,
				    			seat:seats[0].seatId
				    		});
				    	});
					});	    			
		    	});
			});
		},
		findByFBUID:function(fbuid,cb){
			db.collection('users', function(err, users) {
		    	users.find({fbuid:fbuid}).toArray(function(err,items){
		    		if(cb) cb(items);
		    	});
			});
		},
		save:function(item,cb){
		    db.collection('users', function(err, users) {		
				users.save(item);
				if ( cb ) cb();
		    });
		}
	});

	dao.reg("Seat",{
		find:function(eventID,fbuid,success,fail){
			db.collection('user_seat', function(err, user_seats) {
		    	//user_seats.remove({});
		    	user_seats.find({
					fbuid: fbuid,
		    		eventId: eventID
		    	}).toArray(function(err,items){
		    		if (err){ throw err; }
		    		if( items.length == 0 ){
		    			if(fail) fail();
		    		}else{
		    			success(item[0]);
		    		}
		    	});
			});
		},
		remove:function(obj){
			db.collection('user_seat', function(err, user_seats) {
				user_seats.remove(obj);
			});
		}
	});
	var queue = [], opened = false;
	dao.after = function(fn){
		if(opened){
			fn();
		}else{
			queue.push(fn);
		}
	};

	dao._init = function(){
		for(var i = 0 ; i < queue.length ;++i){
			queue[i]();
		}
		queue = null;
	}
	db.open(function(err) { 
	  if(err) throw err;
	  opened = true;
	  dao._init();
	});

})(dao,db);

//var books ={
//	seqNo:,
//	author:"",
//	pttLink:"",
//	postDate:"2012/8/ ",
//	pttcomments:,
//	name :"",
//	type :"",
//	buytime:"",
//	buyplace:"",
//	link :"",
//	img :"",
//	howtoget :"",
//	why :"",
//	think :"",
//	worth :"Yes",
//	suggest:"*****"
//};
//


//dao.insertDefaultBook();
/*
dao.getBooks(function(){
	console.dir(arguments);
});  
*/
//dao.getBook(7,function(err,item){
//	console.log(item[0].think.replace(/\n/gi,"<br />"));
//});  
