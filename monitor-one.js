
if(process.argv.length<=2){
	console.log('requires path/to/apache/acces_log [label]');
	process.exit(1);
}

var path=process.argv[2];
var label=path.split('/').pop();
if(process.argv.length>=4){
	label=process.argv[3];
}


require('fs').exists(path,function(exits){

	if(exits){
		
		var lastlocation=false;
		var lastip=null;
		var colors = require("colors");
		
		require('./nasql.js').monitor(label , path).on('access',function(data){
			
			var location=(function(obj){
				if(obj===false)return false;
				return obj.city+', '+obj.region_name+', '+obj.country_name;

			})(require('./node-freegeoip.js').lookup(data.ip));
			
			if(lastlocation!==location||lastip!==data.ip){
				console.log('');
				console.log(colors.blue(data.ip+': '+(location!==false?', '+location:'')));
				
	
				lastlocation=location;
				lastip=data.ip;
			}
			
			console.log(require('./log-format.js').format(data));
		});	

	}else{
		console.log('file does not exist');
		process.exit(1);
	}

});



