module.exports = {
                format: format
}
var colors = require("colors");
function format(data){
	
	
	if(data.url.indexOf('/administrator')!==-1){
		return {url:colors.red(data.url)};
	}
	
	
}