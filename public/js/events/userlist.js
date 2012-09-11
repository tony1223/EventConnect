define(["jquery","FB","global"],function($,FBUtil,global){

	return function (eventId){
		
		var list = this;
		$.get("/api/getUserSeats/" + eventId +"?time="+new Date().getTime(),function(response){
			if(response.isSuccess){
				var $seats= $(".seat");
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
					var user = $("<tr><td>"+this.name+"</td></tr>");
					user.data("info",this);
					$("#users").append(user);
				});

			    global.on("logined",function(){
			    	if(userSeats){
						FB.api('/me/friends', function(response) {        
							if(!response.data){
								return false;
							}
							var out = [];
							$.each(response.data,function(){
								if(userSeats[this.id]){
									out.push(list.userSeats[this.id].name);
								}
							});
							
							if(out.length){
								jAlert("您有幾位朋友已經參與這個活動，馬上找到他們吧？\n朋友清單："+
									out.join("\n")
								);
							}else{
								jAlert("您目前沒有 fb 好友參加本場活動");
							}
					      //  _friend_data = response.data.sort(sortByName);
					    });
					}
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

		return this;
	};
});