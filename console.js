var db = require("./db");

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
      events.find({_id:new db.ObjectId("504184c96ba1ca1406000001")}).toArray(function(err,items){ 
        console.log(items);
      });       
      db.close();   
    }); 
}); 