define(["jquery"],function($){
	window.eventId = $("#eventId").val();
	$.get("/api/getUserSeats/"+window.eventId ,function(response){
		if(response.isSuccess){
			var $seats= $(".seat");
			window.userSeats = {};
			$.each(response.data,function(){
				var self = $seats.find("#"+this.seatId)[0];
				if(self.getAttribute("fill").toLowerCase() == "#ff0000"){
					self.setAttribute("fill","#0000FF");
					self.title =  this.name;
					self.uid = this.fbuid;
				}
				window.userSeats[this.fbuid] = this; 
				var user = $("<tr><td>"+this.name+"</td></tr>");
				user.data("info",this);
				$("#users").append(user);
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