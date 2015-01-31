
if(process.argv.length<=2){
	console.log('requires path/to/apache/acces_log [label]');
	process.exit(1);
}

var path=process.argv[2];
var label=path.split('/').pop();
if(process.argv.length>=4){
	label=process.argv[3];
}


require('fs').exists(path,function(exits){

	if(exits){
		
		require('./nasql.js').monitor(label , path).on('access',function(data){
			console.log(JSON.stringify(data));
		});	

	}else{
		console.log('file does not exist');
		process.exit(1);
	}

});



