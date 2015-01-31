


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
			console.log('starting monitor: '+vh.name+' '+config.log);		
			//console.log(config); process.exit(0);
			
			//return;
			//
				
			
			require('./nasql.js').monitor(vh.name , config.log).on('access',function(data){
				
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
				
				
						

				console.log((function(d){
					var url=d.url;
					var method=d.method;
					if(d.url.indexOf('/administrator')!==-1){
						url=colors.red(url);
					}
					
					if(url.indexOf('index.php?option=com_geolive&format=ajax')!==-1){
						url=colors.blue('Geolive: ')+'ajax task: '+colors.blue(url.split('&task=')[1].split('&')[0]);
					}
					
					if(d.method=='POST'){
						method=colors.red(method)
					}

					if(d.method=='GET'){
                                                method=colors.green(method)
                                        }
				
					var status=d.status;
					
					if((['200', '304']).indexOf(status)!==-1){
						status=colors.green(status);
					}
					if((['403', '404', '500']).indexOf(status)!==-1){
                                                status=colors.red(status);
                                        }
					
					var bytes=d.bytes;
					var units='b';
					if(bytes>1024){
						bytes=bytes/1024.0;
						units='kb';
					}
			
					if(bytes>1024){
						bytes=bytes/1024.0;
                                                units='mb';
					}

					if(bytes>1024){
                                                bytes=bytes/1024.0;
                                                units='gb';
                                        }
					
					if(units!=='b'){
						bytes=Math.round(bytes*10)/10.0;
					}
					
					return  'Request: '+method+' '+url+', '+
					   	'Status: '+status+', '+
						'Sent: '+bytes+units; //' - '+d.stat_size;
				})(data));

			})
	
		});
			

	});
	
	
});
