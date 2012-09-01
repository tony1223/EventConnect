
if(jQuery != null){
	(function($,window,undefined){
		$(function(){
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
						var user = $("<div>"+this.name+"</div>");
						user.data("info",this);
						user.addClass("btn");
						$(".userlist").append(user);
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

			window.fbAsyncInit = function() {
			    FB.init({
			      appId      : '454565751232147', // App ID
			      channelUrl : '//eventconnect.tonyq.org/channel.html', // Channel File
			      status     : true, // check login status
			      cookie     : true, // enable cookies to allow the server to access the session
			      xfbml      : true  // parse XFBML
			    });
			    $("#join").show();

			    function doLogin(fbuid,name){
			    	window.loginInfo = {uid :fbuid ,name:name };
			    	$(".seat rect").each(function(){
						if(this.uid == fbuid){
							this.setAttribute("fill","#00FF00");
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
					   		$.get("/api/getUserName/"+uid).then(function(data){
					   			if(data.isSuccess){
					   				name = data.data;
					   				//alert("welcome back,"+name);
					   				$(".toolbar .login ").hide();
					   				$(".auth").show();
					   				$("#username").html("User:"+name);
					   				if(data.cb) data.cb();
					   				doLogin(uid,name);
					   			}else{
					   				name = window.prompt("您好，請輸入一個您想要的暱稱");
					   				$.post("/api/setUserName/"+uid,{name:name},function(){
										$("#username").html("User:"+name);
										doLogin(uid,name);
										if(data.cb) data.cb();
										$(".auth").show();
					   				});
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
			    // Additional initialization code here
			  };

			  // Load the SDK Asynchronously
			  (function(d){
			     var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
			     if (d.getElementById(id)) {return;}
			     js = d.createElement('script'); js.id = id; js.async = true;
			     js.src = "//connect.facebook.net/en_US/all.js";
			     ref.parentNode.insertBefore(js, ref);
			   }(document));
		});
	})(jQuery,window);

}