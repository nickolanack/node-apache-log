module.exports = {
                format: format
}
function format(data){
	
	
	if(data.time==undefined)return;
	
	return {time:data.time+'s'}

	
}