module.exports = {
                format: format
}

function format(data){
	
	
	
	var url=data.url;
	var method=data.method;
	if(data.url.indexOf('/administrator')!==-1){
		url=colors.red(url);
	}
	
	if(url.indexOf('index.php?option=com_geolive&format=ajax')!==-1){
		url=colors.blue('Geolive: ')+'ajax task: '+colors.blue(url.split('&task=')[1].split('&')[0]);
	}
	
	if(data.method=='POST'){
		method=colors.red(method)
	}

	if(data.method=='GET'){
                                method=colors.green(method)
                        }

	var status=data.status;
	
	if((['200', '304']).indexOf(status)!==-1){
		status=colors.green(status);
	}
	if((['403', '404', '500']).indexOf(status)!==-1){
                                status=colors.red(status);
                        }
	
	var bytes=data.bytes;
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
		'Sent: '+bytes+units; //' - '+data.stat_size;
	
	
	
	
}