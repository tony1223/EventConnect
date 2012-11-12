/**
 * Module dependencies.
 */
global.config = require("./config");

var dao = require("./dao");
dao.after(function() {
  var express = require('express'),
    routes = new require('./routes')(dao),
    app = express(),
    CookieStore = require('cookie-sessions'),
    port = 3000 , 
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    IRC = require("./tool/irc");

  var irc = new IRC(global.config.ircName,global.config.ircPassword);
  io.sockets.on('connection', function (socket) {
    socket.on('msg', function (channel) {
      irc.listen(channel,function(from,to,message){
        socket.emit('msg', { from:from,to:to,message:message});
      });
    });
  });

  // Configuration
  app.configure(function() {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(require('less-middleware')({
      src: __dirname + '/public/',
      force: true,
      compress: false /*, debug:true*/
    }));
    app.use(CookieStore({
      secret: global.config.secret
    }));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
  });
  app.configure('development', function() {
    app.use(express.errorHandler({
      dumpExceptions: true,
      showStack: true
    }));
  });

  app.configure('production', function() {
    app.use(express.errorHandler());
  });

  // Routes
  app.get('/', routes.index);
  app.get('/admin', routes.admin.index);

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

  app.post('/api/logout', routes.api.logout);
  app.post('/api/login/:fbuid', routes.api.login);
  app.post('/api/cancelEvent', routes.api.cancelEvent);
  app.post('/api/joinEvent', routes.api.joinEvent);
  app.post('/api/setUserName/:fbuid', routes.api.setUserName);
  app.post('/api/doOrderSeat/', routes.api.doOrderSeat);

  app.get('/api/getUserSeats/:eventId', routes.api.getUserSeats);


  server.listen(80);
  console.log("Express server listening on port: " + port + " on " + new Date());

});

