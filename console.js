    var db = require("./db");
    db.open(function(err) {
      if (err) throw err;
        /* Select 'contact' collection */
        db.collection('user_seat', function(err, users) {
          db.close();
      });
    });