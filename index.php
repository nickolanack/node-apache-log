<?php

	$id=session_id();
	if(empty($id)){
		session_start();
		$id=session_id();
	}

	if(key_exists('get', $_GET)){
		
		//shell_exec('cd '.__DIR__);
		//echo shell_exec('pwd');
		$cmd='node '.escapeshellarg('node-apache-log/monitor-web.js').
			' '.$id.' '.escapeshellarg('/var/log/httpd/bcmarinetrails-access_log').
			' 2>&1';
		echo shell_exec($cmd);
		//echo $cmd;
	
		return;
	}


 ?><!DOCTYPE html>
<html>
	<head>
		<style type="text/css">
		

			body {
				margin: 30px;
				margin-top: 65px;
				background-color: white;
				min-height: 100px;
				border-radius: 5px;
				border: 1px solid rgba(0,0,0,0.06);
				height: calc( 100% - 62px );
	
	
				font-family: monospace;
				color: darkslateblue;
			}
			
			body:before {
				content: "Apache Log Monitor";
				position: absolute;
				top: 19px;
				left: 40px;
				font-family: sans-serif;
				font-weight: 100;
				font-size: 30px;
			}
			body:after{
				content: attr(data-state);
				display: inline-block;
				height: 50px;
				line-height: 45px;
				text-indent: 20px;
			}
			
			html {
				background-color: #f9f9f9;
				height:100%;
			}
			
			body>div {
				padding: 10px;
				border-bottom: 1px solid rgba(0,0,0,0.1);
				overflow-wrap: break-word;
			}
			
			.method-get {
				background-color: azure;
			}
			
			.method-post {
				background-color: papayawhip;
			}
			
			.status-303 {
				opacity: 0.7;
				text-decoration: line-through;
			}
					
		</style>
		<script type="text/javascript">
			(function(){
				
				var query=function(){
				
					
				xmlhttp=new XMLHttpRequest();
				xmlhttp.onreadystatechange=function(){
					
	
					if(xmlhttp.readyState==4 && xmlhttp.status==200){
						document.body.setAttribute('data-state','');
						data=JSON.parse(xmlhttp.responseText);

						var queue=[];
						_running=false;
						var run=function(){
							if(_running)return;
							_running=true;
							if(queue.length){
								setTimeout(function(){
									document.body.appendChild((queue.splice(0,1))[0]);

									while(document.body.childNodes.length>500){
										document.body.removeChild(document.body.firstChild);
									}
									
									_running=false;
									run();
								},50);
							}else{
								_running=false;
							}

						};
						
						data.forEach(function(line){
							var div=document.createElement("DIV");
							if((typeof line)!='string'){

								if(line.event==='access'){
									div.classList.add('method-'+(line.method.toLowerCase()));
									div.classList.add('status-'+line.status);
									div.classList.add('event-'+line.event);
									div.setAttribute('data-bytes', line.bytes);
									div.setAttribute('data-ip', line.ip);
	
									var bytes=line.bytes;
									var bu="Bytes";
									if(bytes>1024){
										bytes=Math.round(bytes/1024);
										bu="KBs"
									}
	
									if(bytes>1024){
										bytes=Math.round(bytes/1024);
										bu="MBs"
									}
									
									var str=line.method+': '+line.ip+' '+line.url+' '+bytes+' '+bu;
	
								
									
									if(line.status==304){
										str+=' (cached)';
									}
									line=str;
								}else{
									line=JSON.stringify(line);
								}
							}
							div.innerHTML=line;

							queue.push(div);
							run();


							
							
						});
					}
				};
				xmlhttp.open("GET","?get", true);
				xmlhttp.send();
				document.body.setAttribute('data-state','.');
				};
	
				setInterval(query, 1000);
				
			})();
		
		</script>
	</head>
	<body>
	</body>
</html>

