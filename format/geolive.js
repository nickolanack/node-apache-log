module.exports = {
                format: format
}
var colors = require("colors");
function format(data){
	
	try{
		if(data.url.indexOf('index.php?option=com_geolive&format=ajax')!==-1){
			var p=data.url.indexOf('iam=');
			var usr='';
			if(p!==-1){
				var e=data.url.indexOf('&',p+1);
				if(e!==-1){
					usr='('+data.url.substring(p+4,e)+') ';
				}else{
					usr='('+data.url.substring(p+4)+') ';
				}
			}
			if(data.url.indexOf('&format=raw')!==-1){
				
				if(data.url.indexOf('&pluginView=')!==-1){
					return {url:colors.blue('Geolive: '+usr)+'view: '+colors.blue((data.url.split('&plugin=')[1].split('&')[0])+'->'+(data.url.split('&pluginView=')[1].split('&')[0]))};
				}else{	
					return {url:colors.blue('Geolive: '+usr)+'view: '+colors.blue(data.url.split('&view=')[1].split('&')[0])};
				}
			}
			return {url:colors.blue('Geolive: '+usr)+'ajax task: '+colors.blue(data.url.split('&task=')[1].split('&')[0])};
		}
	}catch(e){
		console.log('url parser error');
		console.error(e);
		console.log(e.stack);
	}
	
}