var Infos ={
	Color:{
		self:"#00FF00",
		ordered:"#0000FF",
		empty:"#ff0000"
	}
};

require(["jquery","fb","events/loaduser"],function($,FBUtil){
	$(function(){
		FBUtil.after(function(FB){
		    $("#join").show();

		    function doLogin(fbuid,name){
		    	window.loginInfo = {uid :fbuid ,name:name };
		    	$(".seat rect").each(function(){
					if(this.uid == fbuid){
						this.setAttribute("fill",Infos.Color.self);
					}
				});
				FB.api('/me/friends', function(response) {        
					var out = [];
					$.each(response.data,function(){
						if(window.userSeats[this.id]){
							out.push(window.userSeats[this.id].name);
						}
					});
					if(out.length){
						alert("您有幾位朋友已經參與這個活動，馬上找到他們吧？\n朋友清單："+
							out.join("\n")
						);
					}else{
						alert("您目前沒有 fb 好友參加本場活動");
					}
			      //  _friend_data = response.data.sort(sortByName);
			    });

		    }

		    function clearMySeat(fbuid){
		    	$(".seat rect").each(function(){
					if(this.uid == fbuid){
						this.setAttribute("fill","#FF0000");
					}
				});
		    }
			$("#join").click(function(e,data){
				 FB.login(function(response) {
				   if (response.authResponse) {
				   		/* accessToken,userID */
				   		var uid = response.authResponse.userID;
				   		var name = "";
				   		$.post("/api/login/"+uid).then(function(data){
				   			if(data.isSuccess){
				   				name = data.data;
				   				//alert("welcome back,"+name);
				   				$(".toolbar .login ").hide();
				   				$(".auth").show();
				   				$("#username").html("User:"+name);
				   				if(data.cb) data.cb();
				   				doLogin(uid,name);
				   			}else{
				   				jPrompt("您好，請輸入一個您想要的暱稱",'','輸入暱稱',
				   					function(name){
						   				$.post("/api/setUserName/"+uid,{name:name},function(){
											$("#username").html("User:"+name);
											doLogin(uid,name);
											if(data.cb) data.cb();
											$(".auth").show();
						   				});
				   					}
				   				);
				   			}
				   		});
				   } else {
				     alert('User cancelled login or did not fully authorize.');
				   }
				 }, {scope:'email,read_friendlists'});
			});
			$(".seat rect").click(function(){
				var self = this;
				if (!window.loginInfo){
					$("#join").trigger("click",
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
						eventId:window.eventId,
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
