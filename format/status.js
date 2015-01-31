module.exports = {
                format: format
}
var colors = require("colors");
function format(data){
	
	var status=data.status;
	
	if((['200', '304']).indexOf(status)!==-1){
		status=colors.green(status);
	}
	if((['403', '404', '500']).indexOf(status)!==-1){
		status=colors.red(status);
    }
	
	return {status:status};
	
}