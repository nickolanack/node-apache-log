
var apache=require('node-apache-config')
apache.getHostsMeta(function(vhosts){


	//console.log(JSON.stringify(vhosts,null,"\t"));
	//process.exit(0);
	var fs=require('fs');

	var lastname=null;
	var lastlocation=false;
	var lastip=null;
	
	var colors = require("colors");

	vhosts.forEach(function(vh){
		
		
		apache.getAccessLog(vh.name, function(file){
			
			require('./nasql.js').monitor(vh.name , file, 'stats').on('log.access',function(data){
				
				var location=(function(obj){
					if(obj===false)return false;
					return obj.city+', '+obj.region_name+', '+obj.country_name;

				})(require('./node-freegeoip.js').lookup(data.ip));
			
				if(lastname!==vh.name||lastlocation!==location||lastip!==data.ip){
					console.log('');
					console.log(colors.blue(data.ip+': '+vh.name+(location!==false?', '+location:'')+' '+file));
					
					lastname=vh.name;
					lastlocation=location;
					lastip=data.ip;
				}
				//log-format returns a formatted log string
				console.log(require('./log-format.js').format(data));

			}).on('error', function(data){
				console.log(JSON.stringify(data));
			});
			
			
		});
		
		
		
		apache.getErrorLog(vh.name, function(file){
			
			require('./nasql.js').monitor(vh.name , file, 'error').on('log.error',function(data){
				
				console.log(JSON.stringify(data));

			}).on('error', function(data){
				console.log(JSON.stringify(data));
			});
			
			
		});

	});
	
	
});
