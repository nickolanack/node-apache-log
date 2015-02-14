module.exports = {
                parse: parse
            
}

function parse(line){
	try{
		
		
		var date=line.split(']',1)[0];
		line=line.substring(date.length+1);
		
	
	
		date=date.replace(/^\s+/g, '').substring(1);
		
		var type=line.split(']',1)[0];
		line=line.substring(type.length+1);
		
		type=type.replace(/^\s+/g, '').substring(1);
		
		var client=line.split(']',1)[0];
		var error=line.substring(client.length+1).replace(/^\s+/g, '');
		
		client=client.substring(client.indexOf(' ')+1).replace(/^\s+/g, '');
	
	     var data={
	    		 event:'error',
	            // line:line,
	             time:date,
	             type:type,
	             error:error,
	             ip:client
	             
	     }
	}catch(e){
		console.log('Error log parser: exception parsing line');
		console.error(e);
		console.log(line);
	}

     return data;
	
}