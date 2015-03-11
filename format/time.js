module.exports = {
                format: format
}
function format(data){
	
	
	if(data.time==undefined)return;
	
	return {time:Math.round(data.time/100.0)/10.0+'ms'}

	
}