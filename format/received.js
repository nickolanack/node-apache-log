module.exports = {
                format: format
}
function format(data){
	
	if(data.received===undefined)return;
	
	var bytes=data.received;
	
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
	
	return {received:bytes+units};
	
	
}