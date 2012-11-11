var irc = require('irc');

var IRCWrapper = function() {
		this._cmdQueue = [];
		this._channels = {};
	};
IRCWrapper.prototype.connect = function(name,password,cbConnect) {
	var wrapper = this,
		client = wrapper._client = new irc.Client('irc.freenode.net', 'EcRobot', {
			channels: [],
			realName: 'Event Connect Irc Client'
			//debug: true
		});

	client.on("registered",function(message){
		client.say('NickServ', "IDENTIFY "+name+" "+password);
		try{
			if(!wrapper._linked){
				if(cbConnect) {
					setTimeout(cbConnect, 500);
				}
				wrapper._linked = true;
				for(var i = 0; i < wrapper._cmdQueue.length ; ++i) {
					wrapper._cmdQueue[i].apply(wrapper);
				}
				wrapper._cmdQueue = null;
			}
		}catch(ex){
			console.log("exception:"+ex);
		}			
	});
	client.on('error', function(message) {
		console.log('irc error: ', message);
	});

};

IRCWrapper.prototype.after = function(fn) {
	var wrapper = this;
	if(wrapper._linked) {
		fn.apply(wrapper);
	}else{
		this._cmdQueue.push(fn);
	}
};

IRCWrapper.prototype.add = function(channel,log_method) {
	this.after(function() {
		if(this._channels[channel] != null) {
			return false;
		}
		this._client.join(channel);
		this._client.on('message'+channel, log_method);
	});
};

module.exports = IRCWrapper;
