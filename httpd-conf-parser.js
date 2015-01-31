module.exports = {
                parse: parse
}

function parse(conf, line){
	
	conf=conf.split("\n").slice(line).join("\n");
	
	

	var root=conf.split('DocumentRoot')[1].split("\n")[0].replace(/^\s+/g, '').split(' ')[0];
	var log=conf.split('CustomLog')[1].split("\n")[0].replace(/^\s+/g, '').split(' ')[0];


	return {root:root, log:log};


}
