module.exports = {
                format: format
}
var colors = require("colors");
function format(data){
	
	
	if(data.method=='POST'){
		return {method:colors.red(data.method)};
	}

	if(data.method=='GET'){
		return {method:colors.green(data.method)};
    }

	
	
	
}