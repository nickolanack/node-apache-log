
console.log('Starting Apache-Log-Monitor Server');

var conf={
	port:9384,
	timeout:-1
};

var settings='./monitor_sock.json';

var clients=null;

if(process.argv.length<=2){
	console.log('requires path/to/apache/acces_log [label]');
	process.exit(1);
}

var path=process.argv[2];
var label=path.split('/').pop();
if(process.argv.length>=4){
	label=process.argv[3];
}

var monitor=null;
getClientData=function(name){

	if(clients===null){

		clients={};

		require('fs').exists(path,function(exists){


			if(exists){
				
				var error_log=false;
				if(path.indexOf('-access_log')>=0){
					var error_log=path.replace('-access_log','-error_log');
				}
			
				require('./apache-log-monitor.js').monitor(label , path).on('log.access',function(data){
					Object.keys(clients).forEach(function(k){
						clients[k].lines.push(data);
					});
				}).on('error', function(data){
					Object.keys(clients).forEach(function(k){
						clients[k].lines.push(data);
					});
				});

				require('fs').exists(error_log,function(exists){

					if(exists){

						require('./apache-log-monitor.js').monitor(label+' error_log' , error_log, 'error').on('log.error',function(data){
							Object.keys(clients).forEach(function(k){
								clients[k].lines.push(data);
							});
						}).on('error', function(data){
							Object.keys(clients).forEach(function(k){
								clients[k].lines.push(data);
							});
						});

					}

				});


			}else{
				console.log('file:'+path+' does not exist');
				process.exit(1);
			}

		});
		
	}

	if(clients[name]===undefined){
		clients[name]={lines:[]};
	}
	
	clients[name].last=Date.now();
	var lines=clients[name].lines;
	clients[name].lines=[];
	
	
	Object.keys(clients).forEach(function(v, k){
		if((Date.now()-v.last)>15*1000){
			delete client[k];
		}
	});
	
	
	return lines;
	
}


require('fs').exists(settings,function(exists){
	
	if(exists){
		console.log('already running');
	}else{
		
		var _timeout=null;
		var server=null;
		var timeout=function(time){
			
			if(time<=0)return;
			
			if(_timeout!==null){
				clearTimeout(_timeout);
			}
			
			_timeout=setTimeout(function(){
				
				server.close();
				
			},time);
			
		}
		
		
		
		server = require('net').createServer(function(socket) { 
			//'connection' listener
			socket.setEncoding('utf8');
			console.log('client connected');
			
			socket.on('end', function() {
				console.log('client disconnected');
			});
			
			socket.on('data',function(data){
				timeout(conf.timeout*1000);
				if(data.indexOf('list updates ')===0){
					
					var user=data.split('list updates ')[1];
					socket.write(JSON.stringify(getClientData(user)));
					
				}
				console.log(data);
				
			});
			
			
		});
		
		timeout(conf.timeout*1000);


		server.listen(conf.port, function() { //'listening' listener
			
			console.log('server bound');
			require('fs').writeFile(settings, JSON.stringify(conf));
			
		});
	

		server.on('close', function(err){
			console.log('server closed');
			require('fs').unlink(settings);
		});



		
		
		
		
		
		
	}
	
	
});
