define(["jquery","fb","global"],function($,FBUtil,global){

	return function (eventId){
		
		var list = this;
		global.on("markFriendList",function(e,data){
			FB.api({
				    method: 'fql.query',
				    query: 'SELECT uid,name FROM user WHERE uid IN (SELECT uid2 FROM friend WHERE uid1 = me())'
				}, function(response) {        

					var users = $("#users");
					$.each(response,function(){
						var target = users.find("#fb-"+this.uid);
						if(target.length){
							target.find("i").removeClass("icon-user").addClass("icon-heart");
						}
					});

		    });
		});

		global.on("refreshUserList",function(){
			$.get("/api/getUserSeats/" + eventId +"?time="+new Date().getTime(),function(response){
				if(response.isSuccess){
					var $seats= $(".seat");
					$("#users").html("");
					var userSeats = list.userSeats = {};
					$.each(response.data,function(){
						if (this.seatId){
							var self = $seats.find("#"+this.seatId)[0];
							if(self.getAttribute("fill").toLowerCase() == "#ff0000"){
								self.setAttribute("fill","#0000FF");
								self.title =  this.name;
								self.uid = this.fbuid;
							}
						};
						list.userSeats[this.fbuid] = this; 
						var user = $("<tr><td id='fb-"+this.fbuid+"'><i class='icon-user'></i>"+this.name+"</td></tr>");
						user.data("info",this);
						$("#users").append(user);
					});

				    global.on("logined",function(e,data){
				    	global.trigger("markFriendList");
				    });

					function findSeat(seatId){
				    	return $(".seat").find("#"+seatId)[0];
					}

					$(".userlist").on("mouseover",".btn",function(){
						$(this).data("overing",true);
						var info = $(this).data("info");
						var svg = findSeat(info.seatId)
						$(svg).data("oldfill",svg.getAttribute("fill"));
						svg.setAttribute("fill","orange");
					}).on("mouseout",".btn",function(){
						$(this).data("overing",false);
						var info = $(this).data("info");
						var svg = findSeat(info.seatId)			
						svg.setAttribute("fill",$(svg).data("oldfill"));
					}).on("mousedown",".btn",function(){
						if(!$(this).data("overing")){
							var info = $(this).data("info");
							var svg = findSeat(info.seatId)
							$(svg).data("oldfill",svg.getAttribute("fill"));
							svg.setAttribute("fill","orange");
						}
					}).on("mouseup",".btn",function(){
						if(!$(this).data("overing")){
							var info = $(this).data("info");
							var svg = findSeat(info.seatId)			
							svg.setAttribute("fill",$(svg).data("oldfill"));
						}
					});
				}
			});
		});
		global.trigger("refreshUserList");
		return this;
	};
});