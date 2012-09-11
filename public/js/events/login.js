define(["jquery","fb","global"],function($,FBUtil,global){
	return function (eventId){

		var toolbar = $(".toolbar");
		
		toolbar.on("login",function(e){
			$(".toolbar").addClass("notjoin").removeClass("notlogin").removeClass("joined");
		});
		toolbar.on("join",function(e){
			$(".toolbar").addClass("joined").removeClass("notlogin").removeClass("notjoin");
		});
		toolbar.on("logout",function(e){
			$(".toolbar").addClass("notlogin").removeClass("joined").removeClass("notjoin");
		});

	    function doLogin(fbuid,name,join,access){
	    	window.loginInfo = {uid :fbuid ,name:name,access:access };
	    	if(!join){
	    		toolbar.trigger("login");
	    	}else{
	    		toolbar.trigger("join");
	    	}
	    	global.trigger("logined",{info:window.loginInfo});
	    	$(".seat rect").each(function(){
				if(this.uid == fbuid){
					this.setAttribute("fill",Infos.Color.self);
				}
			});
			$("#username").click(function(){
				$("#username").trigger("rename",{fbuid:fbuid});
			});			
			$("#username").text("User:"+name);
			
	    }
		toolbar.find("#username").on("rename",function(e,data){
			jPrompt("您好，請輸入一個您想要的暱稱",'','輸入暱稱',
				function(name){
					if(name){
		   				$.post("/api/setUserName/" + data.fbuid,{name:name},function(){
		   					window.loginInfo = window.loginInfo ||{};
		   					window.loginInfo.name = name;
							$("#username").html("User:"+name);
		   				});
		   				if(data && data.cb){
		   					data.cb();
		   				}
		   			}
				}
			);
		});	    
	    toolbar.find(".auth .cancel").click(function(){
	    	if (window.loginInfo){
	    		var userInfo = window.loginInfo;
	    		$.post("/api/cancelEvent/",
	    			{
	    				eventId:eventId,
	    				fbuid:userInfo.uid
	    			}).then(
	    			function(data){
	    				self.location.reload();
	    			}
	    		);
	    	}
	    });
		toolbar.find(".auth .join").click(function(){
	    	if (window.loginInfo){
	    		var userInfo = window.loginInfo;
	    		$.post("/api/joinEvent/",
	    			{
	    				eventId:eventId,
	    				fbuid:userInfo.uid,
	    				name:userInfo.name
	    			}).then(
	    			function(data){
	    				self.location.reload();
	    			}
	    		);
	    	}
	    });

		$("#login").click(function(e,data){
			FBUtil.after(function(FB){
				FB.login(function(response) {
					if (response.authResponse) {
							/* accessToken,userID */
							var uid = response.authResponse.userID;
							var name = "";
							$.post("/api/login/"+uid,
									{
										accesstoken:response.authResponse.accessToken
									}
								,function(data){
								if(data.isSuccess){
									name = data.name;
									if(!name){	
										$("#username").trigger("rename",{
											cb:function(){
												doLogin(uid,name,false,response.authResponse.accessToken);
												if(data.cb) data.cb();
											},
											fbuid : uid
										});		
									}else{							
										if(data.cb) data.cb();
										doLogin(uid,name,data.join,response.authResponse.accessToken);
									}
								}
							});
					} else {
					 alert('User cancelled login or did not fully authorize.');
					}
				}, {scope:'email,read_friendlists,offline_access'});
			});
		});

		$("#Logout").click(function(){
			$.post("/api/logout",function(){
				self.location.reload();
			});
		});

		var name = toolbar.data("name"),
			fbuid = toolbar.data("fbuid"),
			join =  toolbar.data("join"),
			access =  toolbar.data("access");
		toolbar.removeClass("preparing");
		if(fbuid != "" && fbuid ){
			doLogin(fbuid,name,join,access);
			//Already logined;
			return true;
		}else{
			toolbar.addClass("notlogin");
		}

	}
});