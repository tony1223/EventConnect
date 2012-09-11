
/**
 * Module dependencies.
 */

var db = require("./db");
db.open(function(err) { 
  if(err) throw err;
});

var express = require('express');
var routes = require('./routes')(db);
var app = express();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(require('less-middleware')({ src: __dirname + '/public/' ,force:true ,compress: false/*, debug:true*/}));

  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});
app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes
app.get('/admin', routes.index);

app.get('/admin/new', routes.admin._new);
app.post('/admin/create', routes.admin.create);
app.get('/admin/edit/:id', routes.admin.edit);
app.get('/admin/delete/:id', routes.admin["delete"]);
app.post('/admin/update/:id', routes.admin.update);

app.get('/admin/editBackground/:id', routes.admin.editBackground);
app.get('/admin/editBackgroundInner/:id', routes.admin.editBackgroundInner);
app.post('/admin/updateBackground/:id', routes.admin.updateBackground);

app.get('/admin/editSeat/:id', routes.admin.editSeat);
app.get('/admin/editSeatInner/:id', routes.admin.editSeatInner);
app.post('/admin/updateSeat/:id', routes.admin.updateSeat);

app.get('/event/:id', routes.event);


app.get('/api/getUserName/:fbuid', routes.api.getUserName);
app.post('/api/setUserName/:fbuid', routes.api.setUserName);
app.post('/api/doOrderSeat/', routes.api.doOrderSeat);

app.get('/api/getUserSeats/:eventId', routes.api.getUserSeats);


app.listen(3000);
console.log("Express server listening on port:"+new Date());
