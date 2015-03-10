
if(process.argv.length<=2){
	console.log('requires string:indentifier [string:pathto-access_log], [label]');
	process.exit(1);
}

var settings='./monitor_sock.json';
var myname=process.argv[2];





var request=function(){
	
	require('fs').readFile(settings,function(err,data){
		
		var conf=JSON.parse(data);
		//('./monitor_sock.json');
		var socket = new require('net').Socket();
		
		socket.on('error',function(e){
			console.error(e);
		});
		
		socket.on('end',function(e){
			//console.log('disconnected');
		});
		
		socket.on('data',function(data){
			
			console.log(data);
			socket.end();
			
		});
		
		socket.connect(conf.port,function(){
			socket.setEncoding('utf8');
			//console.log('connected');
			socket.write('list updates '+myname);
			
		});
		
	});
	
}


if(require('fs').exists(settings,function(exists){
	
	if(exists){
		
		//console.log('existed');
		request();
		
		
		
	}else{
		
		if(process.argv.length>=4){
			
			var path=process.argv[3];
			var label=path.split('/').pop();
			if(process.argv.length>=5){
				label=process.argv[4];
			}
			
			
			// start process.
			// this is only done if a path argument is supplied. 
			// and does not work if the current process does not have read
			// access to the log files. It is best to start sock-monitor.js 
			// as a seperate thread (under a root account)
			
			var out = require('fs').openSync('./monitor.log', 'a');
			var err = require('fs').openSync('./monitor.log', 'a');
			console.log('node '+__dirname+'/sock-monitor.js');
			var child = require('child_process').spawn('node',
				[
                    __dirname+'/sock-monitor.js',
                	path,
                    label
                ], {
					detached: true,
					stdio: [ 'ignore', out, err ]
				}
			);
			
	
			child.unref();
			
			setTimeout(function(){
				//console.log('wait');
				request();
				}, 250);
		}else{
			console.log(JSON.stringify([{event:'exception', message:'could not find socket'}]));
		}
		
	}
	
	
	
}));



