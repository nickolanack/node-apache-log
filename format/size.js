module.exports = {
                format: format
}
var colors = require("colors");
function format(data){
	
	
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
	
	return {bytes:bytes+units};
	
	
}