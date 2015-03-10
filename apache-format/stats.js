module.exports = {
                parse: parse
            
}

function parse(line){
	
	 var parts=line.split(' ');
     var data={
    		 event:'access',
             ip:parts[0],
             time:(function(dateStr){
                     var str=dateStr.replace(/[\[\]-]/g, '').replace(/[\/]/g,' ').replace(/[:]/, ' ');
                     var millis=Date.parse(str);
                     return millis;

             })(parts[3]+' '+parts[4]),
             method:parts[5].substring(1),
             url:parts[6],
             version:parts[7].substring(0,parts[7].length-1),
             status:parts[8],
             bytes:(function(size){

                     var s=parseInt(size);
                     if(isNaN(s))return 0;
                     return s;

             })(parts[9]),
             received:(function(size){

                 var s=parseInt(size);
                 if(isNaN(s))return 0;
                 return s;

             })(parts[10]),
             time:(function(size){

                 var s=parseInt(size);
                 if(isNaN(s))return 0;
                 return s;

             })(parts[11])
         
             
             
             
     }

     return data;
	
}