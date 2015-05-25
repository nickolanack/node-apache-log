

var events=require('events');
var fs=require('fs');	

function ApacheLogMonitor(name, logfile, format){
	
	
	var me=this;
	me._debug=false;
	events.EventEmitter.call(me);
	if(format===undefined)format='common';
	
	var formats=['common', 'error', 'stats'];
	if(formats.indexOf(format)===-1){
		throw new Error('Unknown log format: \''+format+'\'. Epected one of '+JSON.stringify(formats));
	}
	me._format=format;
	me._parseLine=require('node-apache-log-parser').parse;

	me._name=name;
	me._logfile=logfile;
	
	fs.exists(logfile, function(exists){
		if(exists){
			me._monitor(logfile);
		}else{
			console.log('file does not exist: '+logfile+', done.');
		}
	})
	

};

ApacheLogMonitor.prototype.__proto__=events.EventEmitter.prototype;
ApacheLogMonitor.prototype.debug=function(){
	
	var me=this;
	me._debug=true;
	return me;
	
}
ApacheLogMonitor.prototype._monitor=function(resource){
	
	var me=this;
	
	/*
	
	//I've commented out the database section, since it is not being used at the moment.
	
	var db=require('sqlite3').Database;
	var sqlfile=''; //random disk based file (non-persistant).
	var db=new db(sqlfile);
	
	//check table and if it does not exist. then create it.
	db.get('SELECT name FROM sqlite_master WHERE type=\'table\' and name=\'access_log\'',function(err, row){
	
	        if(err)throw err;
	
	        if(row===undefined){
	                db.run('CREATE TABLE access_log(ip TEXT, time INTEGER, method TEXT, url TEXT, version TEXT,  status INTEGER, bytes INTEGER)');
	        }else{
	        		//it did exists, print all records.
	                db.each('SELECT * FROM access_log ORDER BY time ASC', function(err, row){
	                        console.log(JSON.stringify(row));
	                });
	        }
	
	
	});

	me.on('access',function(data){

		db.run('INSERT INTO access_log '+
                       '(ip, time, method, url, version, status, bytes) '+
                       'VALUES (@ip, @time, @method, @url, @version, @status, @bytes);',
                       (function(obj){
                       		var insert={};
                                ['ip', 'time','method', 'url', 'version', 'status', 'bytes'].forEach(function(k){ insert['@'+k]=obj[k]});
                                return insert;
               		})(data)
		);

	});

	*/

	
	var lastSize=0;
	fs.stat(resource, function(err,stat){
		if(err){
			console.log('fs.stat error');
			console.error(err);
			return;
		}
		lastSize=stat.size;
	});
	
	

	var reading=false;
	var listener=null;
	var watch=function(event){
		if(reading){
			return;
			console.log('skip (concurrency)');	
		}
		//console.log(event+' '+me._name+' '+JSON.stringify(name));
		reading=true;
		fs.stat(resource, function(err,stat){
			
			// console.error(err);
               		// console.log(event+': '+JSON.stringify(stat));
   	 		var size=stat.size-lastSize;
			//console.log(size-lastSize); 
			if(size==0){
				//console.log('no difference');
				reading=false;
				return;
			}
			//
			if(me._debug){
				console.log(resource+': '+JSON.stringify({last:lastSize, current:stat.size, increase:size}));
			}
			fs.open(resource, 'r', function(err, fd) {
   				 if (err) {
   					 	fs.close(fd);
   					 	console.log('fs.open error');
        				console.error(err);
        				reading=false;	
        				return;
    				}
    				var buffer = new Buffer(size);
    				fs.read(fd, buffer, 0, size, stat.size-size, function(err, num) {
    				fs.close(fd); //close, done.
					if(err){
						console.log('fs.read error');
						console.log('read err');
						reading=false;
						return false;
					}
					
					

					/*
 					 * 213.249.50.91 - - [29/Jan/2015:21:56:52 -0800] "GET /component/content//index.php?option=com_jce&task=plugin&plugin=imgmanager&file=imgmanager&method=form&cid=20&6bc427c8a7981f4fe1f5ac65c1246b5f=cf6dd3cf1923c950586d0dd595c8e20b HTTP/1.1" 403 28776
        				*/
					
				
					var line=buffer.toString('utf-8', 0, num);
					var line=line.substring(0,line.length-1); //ends with /n
					
					var lines=line.split("\n"); lines.pop();	
					//console.log(lines.length+' lines');
					if(lines==0){
						reading=false;
						return;
					}
					
					if(me._debug){
						console.log(resource+': '+lines.length+' line'+(lines.length==1?'':'s'));
					}
					
					lines.forEach(function(line){
						
						var data=me._parseLine(line, me._format);
						if((typeof data)!=='object'){
							data={
								event:'exception',
								error:'log parser did not return object for line',
								line:line
							};
							me.emit('error', data);	
							return;
						}
						data.stat_size=stat.size
						me.emit("log."+data.event, data);	
						//console.log("log."+data.event);
					});

					
					fs.unwatchFile(resource, listener);
					reading=false;
					lastSize=stat.size;
					//console.log('watch('+resource+')');
					listener=fs.watchFile(resource, watch).on('error',function(err){
           					reading=false;
           					console.log('fs.watchFile error');
                			console.error(err);
        				});	

					setTimeout(function(){
						watch('timeout');
					},100);
				});
			});
		});
	};
	//console.log('watch('+resource+')');
 	listener=fs.watchFile(resource, watch).on('error',function(err){
		reading=false;
		console.log('fs.watchFile error');
		console.error(err);
	});
	
	setTimeout(function(){
        	 watch('timeout');
        },1000);
};



module.exports = {
        monitor: function(name, file, format){
			return new ApacheLogMonitor(name, file, format);
		},
		debug:function(name, file, format){
			return (new ApacheLogMonitor(name, file, format)).debug();
		},
}
