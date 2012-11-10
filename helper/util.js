var dateformat = null;
function loadDateformat(){
	if(dateformat == null){
		dateformat = require('dateformat');
	}
	return dateformat;
}

module.exports = { 
	dateformat:function(str){
		var dateformat = loadDateformat();
		return dateformat(str,"yyyy/mm/dd HH:MM:ss");
	}
};
