var Infos ={
	Color:{
		self:"#00FF00",
		ordered:"#0000FF",
		empty:"#ff0000"
	}
};

require(["jquery","global","FB","events/login","events/userlist","jquery.alerts"],
	function($,global,FBUtil,login,list){
	$(function(){
		var eventId = $("#eventId").val();
		list(eventId);
		FBUtil.after(function(FB){
		    login(eventId);
		    function clearMySeat(fbuid){
		    	$(".seat rect").each(function(){
					if(this.uid == fbuid){
						this.setAttribute("fill","#FF0000");
					}
				});
		    }
			
			$(".seat rect").click(function(){
				var self = this;
				if (!window.loginInfo){
					$("#login").trigger("click",
						{
							cb:function(){
								if(window.loginInfo){
									$(self).trigger("click");
								}
							}
					});
				}else{
					$.post("/api/doOrderSeat/",{
						fbuid:window.loginInfo.uid,
						eventId:eventId,
						name:window.loginInfo.name,
						seatId:self.id
					},function(data){
						if(data.isSuccess){
							clearMySeat(window.loginInfo.uid);
							if(self.getAttribute("fill").toLowerCase() == "#ff0000"){
								self.setAttribute("fill","#00FF00");
								self.title =  name;
								self.uid  = window.loginInfo.uid;
							}
						}
					});
				}
			});		    
		});
	});
});
