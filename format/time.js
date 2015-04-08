module.exports = {
                format: format
}
var colors = require("colors");
function format(data){
	
	
	if(data.time==undefined)return;
	var u='ms';
	var t=Math.round(data.time/100.0)/10.0;
	
	if(t>2000){
		t=Math.round(t/100.0)/10.0;
		u='s';
		
		if(t>5){
			t=colors.red(t);
		}
	}
	return {time:t+u}

	
}