


require('child_process').exec('httpd -t -D DUMP_VHOSTS', function (err, stdout, stderr) {
    	//console.log('stderr: ' + stderr);
    	if (err)throw err;
	var vhosts=require('./httpd-vhost-parser.js').parse(stdout);

	//console.log(JSON.stringify(vhosts,null,"\t"));
	//process.exit(0);
	var fs=require('fs');

	var lastname=null;
	var lastlocation=false;
	var lastip=null;
	
	var colors = require("colors");

	vhosts.forEach(function(vh){
		fs.readFile(vh.conf[0], function (err, data) {
  			if (err) throw err;
  			var config=require('./httpd-conf-parser.js').parse(data.toString(),vh.conf[1]);
			vh.config=config;
		
			//console.log(JSON.stringify(vh, null, "\t"));
			console.log('starting monitor: '+vh.name+' '+config.log+' and '+config.error.split("/").pop());		
			//console.log(config); process.exit(0);
			
			//return;
			//
				
			
			require('./nasql.js').monitor(vh.name , config.log, 'stats').on('log.access',function(data){
				
				var location=(function(obj){
					if(obj===false)return false;
					return obj.city+', '+obj.region_name+', '+obj.country_name;

				})(require('./node-freegeoip.js').lookup(data.ip));
			
				if(lastname!==vh.name||lastlocation!==location||lastip!==data.ip){
					console.log('');
					console.log(colors.blue(data.ip+': '+vh.name+(location!==false?', '+location:'')+' '+config.log));
					
					lastname=vh.name;
					lastlocation=location;
					lastip=data.ip;
				}
				//log-format returns a formatted log string
				console.log(require('./log-format.js').format(data));

			}).on('error', function(data){
				console.log(JSON.stringify(data));
			});
			
			require('./nasql.js').monitor(vh.name , config.error, 'error').on('log.error',function(data){
				
				console.log(JSON.stringify(data));

			}).on('error', function(data){
				console.log(JSON.stringify(data));
			});
	
		});
			

	});
	
	
});
