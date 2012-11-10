var $ = require("jQuery"),
	util = require("../helper/util.js");
module.exports = function(dao) {
	var db = dao._db;

	/*
	 * GET home page.
	 */
	this.index = function(req, res) { /* Select 'contact' collection */
		dao.Event.all(function(items) {
			res.render('index', {
				title: '活動狂 Event Connect',
				events: items,
				dateFormat: util.dateformat
			});
		});
	};

	this.event = function(req, res) {
		dao.Event.find(req.params.id, function(events, item) {

			if(req.session) {
				dao.User.findUserBySeat(req.session.fbuid, item._id, function(user) {
					res.render('event', {
						title: '活動狂 Event Connect',
						event: item,
						user: user
						/*,
						access:req.session.accesstoken
						*/
					});
				}, function() {
					res.render('event', {
						title: '活動狂 Event Connect',
						event: item,
						user: {
							fbuid: '',
							name: ''
						}
						/*,
						access:req.session.accesstoken
						*/
					});
				});
			} else {
				res.render('event', {
					title: '活動狂 Event Connect',
					event: item,
					user: {
						fbuid: '',
						name: ''
					}
					/*,
					access:req.session.accesstoken
					*/
				});
			}
		});
	};

	this.admin = {
		index: function(req, res) { /* Select 'contact' collection */
			dao.Event.all(function(items) {
				res.render('admin/index', {
					title: '活動狂 Event Connect',
					events: items,
					dateFormat: util.dateformat
				});
			});
		},
		_new: function(req, res) {
			res.render('admin/new', {
				title: '建立活動 ',
				dateFormat: util.dateformat
			});
		},
		create: function(req, res) { /* Select 'contact' collection */
			var item = {};
			item.name = req.body.name;
			item.startDate = new Date(req.body.startDate);
			item.endDate = new Date(req.body.endDate);
			dao.Event.save(item, function() {
				res.redirect('/admin/editBackground/' + item._id);
			});

		},
		edit: function(req, res) {
			dao.Event.find(req.params.id, function(events, item) {
				res.render('admin/edit', {
					title: '編輯活動 [' + item.name + ']',
					event: item,
					nav: 0,
					dateFormat: util.dateformat
				});
			});
		},
		delete: function(req, res) {
			dao.Event.find(req.params.id, function(events, item) {
				events.remove({
					_id: new db.ObjectId(req.params.id)
				});
				res.redirect('/Admin');
			});
		},
		update: function(req, res) {
			dao.Event.find(req.params.id, function(events, item) {
				item.name = req.body.name;
				item.startDate = new Date(req.body.startDate);
				item.endDate = new Date(req.body.endDate);
				events.save(item);
				res.redirect('/Admin');
			});
		},
		editBackground: function(req, res) {
			dao.Event.find(req.params.id, function(events, item) {
				res.render('admin/editBackground', {
					title: '編輯活動 [' + item.name + ']',
					event: item,
					nav: 1,
				});
			});
		},
		updateBackground: function(req, res) {
			dao.Event.find(req.params.id, function(events, item) {
				item.background = req.body.background;
				events.save(item);
				res.redirect('/admin/editSeat/' + item._id);
			});
		},
		editBackgroundInner: function(req, res) {
			dao.Event.find(req.params.id, function(events, item) {
				res.render('admin/editBackgroundInner', {
					title: '編輯活動地圖 [' + item.name + ']',
					event: item
				});
			});
		},
		editSeat: function(req, res) {
			dao.Event.find(req.params.id, function(events, item) {
				res.render('admin/editSeat', {
					title: '[' + item.name + '] 編輯活動座位 ',
					event: item,
					nav: 2,
				});
			});
		},
		editSeatInner: function(req, res) {
			dao.Event.find(req.params.id, function(events, item) {
				res.render('admin/editSeatInner', {
					title: '[' + item.name + '] 編輯活動座位',
					event: item,
					nav: 2,
				});
			});
		},
		updateSeat: function(req, res) {
			dao.Event.find(req.params.id, function(events, item) {
				item.seat = req.body.seat;
				var $ = require("jQuery"),
					ids = [];
				$(item.seat).find("ellipse,rect").each(function() {
					ids.push(this.id);
				});
				item.seatIds = ids;
				events.save(item);
				res.redirect('/Admin');
			});
		}
	};

	//this.admin

	this.api = {
		login: function(req, res) {
			dao.User.findByFBUID(req.params.fbuid, function(items) {
				req.session = req.session || {};
				if(items.length == 0) {
					var obj = {
						fbuid: req.params.fbuid
					};
					dao.User.save(obj);
					res.send({
						isSuccess: true,
						data: null
					});
				} else {
					req.session.fbuid = req.params.fbuid;
					res.send({
						isSuccess: true,
						data: items[0].name
					});
				}
			});
		},
		logout: function(req, res) {
			req.session = {};
			res.send({
				isSuccess: true,
				data: null
			});
		},
		cancelEvent: function(req, res) {
			db.Seat.find(req.body.fbuid, req.body.eventId, function /*success*/ () {
				var obj = items[0];
				db.Seat.remove(obj);
				res.send({
					isSuccess: true
				});
			}, function /*fail*/ () {
				res.send({
					isSuccess: false,
					errorMessage: "Not joined this event."
				});
			});
		},
		joinEvent: function(req, res) {
			db.collection('user_seat', function(err, user_seats) {
				//user_seats.remove({});
				user_seats.find({
					fbuid: req.body.fbuid,
					name: req.body.name,
					eventId: req.body.eventId
				}).toArray(function(err, items) {
					if(items.length == 0) {
						var obj = {
							fbuid: req.body.fbuid,
							name: req.body.name,
							eventId: req.body.eventId,
							seatId: null
						};
						user_seats.save(obj);
						res.send({
							isSuccess: true,
							data: obj.name
						});
					} else {
						var obj = items[0];
						obj.seatId = req.body.seatId;
						user_seats.save(obj);
						res.send({
							isSuccess: false,
							errorMessage: "Already joined."
						});
					}
				});
			});
		},
		setUserName: function(req, res) { /* Select 'contact' collection */
			db.collection('users', function(err, users) {
				users.find({
					fbuid: req.params.fbuid
				}).toArray(function(err, items) {
					if(items.length == 0) {
						var obj = {
							fbuid: req.params.fbuid,
							name: req.body.name
						};
						users.save(obj);
						req.session = req.session || {};
						req.session.fbuid = req.params.fbuid;
						res.send({
							isSuccess: true,
							data: obj.name
						});
					} else {
						var obj = items[0];
						obj.name = req.body.name;
						users.save(obj);
						req.session = req.session || {};
						req.session.fbuid = req.params.fbuid;
						res.send({
							isSuccess: true,
							data: obj.name
						});
					}
				});
			});
		},
		getUserSeats: function(req, res) { /* Select 'contact' collection */
			db.collection('user_seat', function(err, user_seats) {
				//user_seats.remove({});
				user_seats.find({
					eventId: req.params.eventId
				}).toArray(function(err, items) {
					res.send({
						isSuccess: true,
						data: items
					});
				});
			});
		},
		doOrderSeat: function(req, res) { /* Select 'contact' collection */
			db.collection('user_seat', function(err, user_seats) {
				//user_seats.remove({});
				user_seats.find({
					fbuid: req.body.fbuid,
					eventId: req.body.eventId
				}).toArray(function(err, items) {
					if(items.length == 0) {
						var obj = {
							fbuid: req.body.fbuid,
							name: req.body.name,
							eventId: req.body.eventId,
							seatId: req.body.seatId
						};
						user_seats.save(obj);
						res.send({
							isSuccess: true,
							data: obj.name
						});
					} else {
						var obj = items[0];
						obj.seatId = req.body.seatId;
						user_seats.save(obj);
						res.send({
							isSuccess: true,
							data: obj.name
						});
					}
				});
			});
		}
	};

	return this;
};