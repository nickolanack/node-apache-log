

var events=require('events');
function ApacheLogMonitor(name, logfile){
	
	var me=this;
	events.EventEmitter.call(me);

	me._name=name;
	me._logfile=logfile;

	me._monitor(logfile);

};

ApacheLogMonitor.prototype.__proto__=events.EventEmitter.prototype;

ApacheLogMonitor.prototype._monitor=function(resource){
	
	var me=this;

	var db=require('sqlite3').Database;
	var sqlfile=''; //random disk based file (non-persistant).
	var db=new db(sqlfile);
	
	db.get('SELECT name FROM sqlite_master WHERE type=\'table\' and name=\'access_log\'',function(err, row){
	
	        if(err)throw err;
	
	        if(row===undefined){
	                db.run('CREATE TABLE access_log(ip TEXT, time INTEGER, method TEXT, url TEXT, version TEXT,  status INTEGER, bytes INTEGER)');
	        }else{
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


	var fs=require('fs');	
	var lastSize=0;
	fs.stat(resource, function(err,stat){
		lastSize=stat.size;
	});
	
	

	var reading=false;
	var listener=null;
	var watch=function(event){
		if(reading){
			return;
			console.log('skip');	
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
			//console.log(lastSize+' '+stat.size+' '+size);
			fs.open(resource, 'r', function(err, fd) {
   				 if (err) {
        				console.error(err);
        				reading=false;	
					return;
    				}
    				var buffer = new Buffer(size);
    				fs.read(fd, buffer, 0, size, stat.size-size, function(err, num) {
        			
					if(err){
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
					lines.forEach(function(line){
						var data=me._parseLine(line);
						data.stat_size=stat.size
						me.emit('access', data);			
					});

					
					fs.unwatchFile(resource, listener);
					reading=false;
					lastSize=stat.size;
					//console.log('watch('+resource+')');
					listener=fs.watchFile(resource, watch).on('error',function(err){
           					reading=false;
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
		console.error(err);
	});
	
	setTimeout(function(){
        	 watch('timeout');
        },1000);
};

ApacheLogMonitor.prototype._parseLine=function(line){
	var me=this;
                                                var parts=line.split(' ');
                                                var data={
                                                        ip:parts[0],
                                                        time:(function(dateStr){
                                                                var str=dateStr.replace(/[\[\]-]/g, '').replace(/[\/]/g,' ').replace(/[:]/, ' ');
                                                                var millis=Date.parse(str);
                                                                return millis;

                                                        })(parts[3]+' '+parts[4]),
                                                        method:parts[5].substring(1),
                                                        url:parts[6],
                                                        version:parts[7].substring(0,parts[7].length-1),
                                                        status:parts[8],
                                                        bytes:(function(size){

                                                                var s=parseInt(size);
                                                                if(isNaN(s))return 0;
                                                                return s;

                                                        })(parts[9])
                                                }

                                                return data;

                                        };

module.exports = {
                monitor: function(name, file){
			return new ApacheLogMonitor(name, file);
		}
}
