
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');

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
app.get('/', routes.index);
app.post('/admin/update/:id', routes.admin.update);
app.get('/admin/edit/:id', routes.admin.edit);
app.get('/admin/editBackground/:id', routes.admin.editBackground);
app.get('/admin/editBackgroundInner/:id', routes.admin.editBackgroundInner);
app.get('/admin/editSeat/:id', routes.admin.editSeat);
app.get('/event/:id', routes.event);

app.listen(3000);
console.log("Express server listening on port:"+new Date());
