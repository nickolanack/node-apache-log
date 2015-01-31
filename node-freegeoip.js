module.exports={
	geocode:geocode,
	lookup:function(ip){

		if(cache[ip]!==undefined){
                	return cache[ip];
        	}
		geocode(ip); //lookup for later.
		return false;
	}
};



var cache={};

function geocode(ip, callback){

	

	if(cache[ip]!==undefined){
		if(callback)callback(cache[ip]);
		return;
	}

	require('https').get('https://freegeoip.net/json/'+ip, function(res){


		var page='';
		res.on('data', function (chunk) {
			page+=chunk;
		});
	
		res.on('end', function (chunk) {
			try{
				var obj=JSON.parse(page);
				cache[ip]=obj;
				if(callback)callback(obj);
			}catch(e){
				//console.log(ip+': geocoder - too busy')
				setTimeout(function(){
					geocode(ip, callback);
				},250);
			}
		});
	}).on('error', function(e) {
		  console.error(e);
	});
}

