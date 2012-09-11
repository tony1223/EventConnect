define(["jquery","FB","global"],function($,FBUtil,global){
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

	    function doLogin(fbuid,name,join){
	    	window.loginInfo = {uid :fbuid ,name:name };
	    	if(!join){
	    		toolbar.trigger("login");
	    	}else{
	    		toolbar.trigger("join");
	    	}
	    	global.trigger("logined");
	    	$(".seat rect").each(function(){
				if(this.uid == fbuid){
					this.setAttribute("fill",Infos.Color.self);
				}
			});
			$("#username").on("rename",function(e){
				jPrompt("您好，請輸入一個您想要的暱稱",'','輸入暱稱',
					function(name){
						if(name){
		   				$.post("/api/setUserName/"+fbuid,{name:name},function(){
							$("#username").html("User:"+name);
		   				});
		   				if(e.data && e.data.cb){
		   					e.data.cb();
		   				}
		   			}
					}
				);
			});
			$("#username").click(function(){
				$("#username").trigger("rename");
			});			
			$("#username").text("User:"+name);
			
	    }
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
							$.post("/api/login/"+uid).then(function(data){
								if(data.isSuccess){
									name = data.data;
									if(data.cb) data.cb();
									doLogin(uid,name);
								}else{
									$("#username").trigger("rename",{
										cb:function(){
										doLogin(uid,name);
										if(data.cb) data.cb();
										}
									});
								}
							});
					} else {
					 alert('User cancelled login or did not fully authorize.');
					}
				}, {scope:'email,read_friendlists'});
			});
		});

		var name = toolbar.data("name"),
			fbuid = toolbar.data("fbuid"),
			join =  toolbar.data("join");

		if(fbuid != "" && fbuid ){
			doLogin(fbuid,name,join);
			//Already logined;
			return true;
		}
	}
});