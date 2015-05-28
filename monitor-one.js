
if(process.argv.length<=2){
	console.log('requires path/to/apache/acces_log [label]');
	process.exit(1);
}

var path=process.argv[2];
var label=path.split('/').pop();
if(process.argv.length>=4){
	label=process.argv[3];
}

var geocode=null;
require('fs').exists(path,function(exists){




	if(exists){
		var error_log=false;
		if(path.indexOf('-access_log')>=0){
			var error_log=path.replace('-access_log','-error_log');
		}


		console.log('starting monitor: '+label+((error_log!==false)?' access, and error log':' access log'));

		var lastlocation=false;
		var lastip=null;
		var colors = require("colors");

		require('./apache-log-monitor.js').monitor(label , path).on('log.access',function(data){

			if(geocode===null){
				geocode=require('./node-freegeoip.js');
			}
			var location=(function(obj){
				if(obj===false)return false;
				return obj.city+', '+obj.region_name+', '+obj.country_name;

			})(geocode.lookup(data.ip));

			if(lastlocation!==location||lastip!==data.ip){
				console.log('');
				console.log(colors.blue(data.ip+': '+(location!==false?', '+location:'')));


				lastlocation=location;
				lastip=data.ip;
			}

			console.log(require('node-apache-log-parser').format(data));
		}).on('error', function(data){
			console.log(JSON.stringify(data));
		});



		require('fs').exists(error_log,function(exists){

			
			if(exists){

				require('./apache-log-monitor.js').monitor(label+' error_log' , error_log, 'error').on('log.error',function(data){
	
					console.log(JSON.stringify(data));
	
				}).on('error', function(data){
					console.log(JSON.stringify(data));
				});
				
			}

		});


	}else{
		console.log('file:'+path+' does not exist');
		process.exit(1);
	}




});







