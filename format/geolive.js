module.exports = {
                format: format
}
var colors = require("colors");
function format(data){

	if(data.url.indexOf('index.php?option=com_geolive&format=ajax')!==-1){
		return {url:colors.blue('Geolive: ')+'ajax task: '+colors.blue(data.url.split('&task=')[1].split('&')[0])};
	}
	
	
}