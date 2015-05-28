var assert = require("assert");


var fs=require("fs");
var file=__dirname+'/testlog.log';


console.log('try to create test file: '+file);
var fd=fs.openSync(file, 'w');
fs.writeSync(fd, '');

if(!fs.existsSync(file)){
	throw Error('Unable to create test log file');
}
fs.closeSync(fd);
var intv;
var fd=fs.openSync(file, 'a');

require('../nasql.js').monitor('Some Name', file).on('log',function(data){
	
	console.log('success!');
	clearInterval(intv);
	fs.closeSync(fd);
	process.exit(0);
	
});
var count=5;
intv=setInterval(function(){
	
	fs.write(fd, '206.87.52.180 - nick [15/May/2015:11:01:56 -0700] "GET /themes/pmahomme/img/col_drop.png HTTP/1.1" 200 132 754 15271'+"\n", function (err) {
		  if (err) throw err;
	});
	count--;
	if(count<=0){
		clearInterval(intv);
	}
	
},1000);


