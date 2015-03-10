module.exports = {
                format: format
}


function format(data){
	
	
	
	var url=data.url;
	var method=data.method;
	
	
	var fobj={};
	//copy object
	Object.keys(data).forEach(function(k){
		fobj[k]=data[k];
	});
	
	['status', 'size', 'method', 'received', 'time', 'joomla', 'geolive'].forEach(function(formatter){
		
		var obj=require('./format/'+formatter+'.js').format(data);
		if(obj!==null&&(typeof obj)=='object'){
			Object.keys(obj).forEach(function(k){
				fobj[k]=obj[k];
			});
		}
		
	});
	
	return  'Request: '+fobj.method+' '+fobj.url+', '+
	   	'Status: '+fobj.status+', '+
		'Sent: '+fobj.bytes+(fobj.received!==undefined?' Recieved: '+fobj.received:'')+(fobj.time!==undefined?' Time: '+fobj.time:''); //' - '+data.stat_size;
		
	
}