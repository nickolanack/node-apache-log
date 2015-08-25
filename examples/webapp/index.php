<?php
$id = session_id();
if (empty($id)) {
    session_start();
    $id = session_id();
}

if (! defined('DS')) {
    define('DS', DIRECTORY_SEPARATOR);
}

if (key_exists('get', $_GET)) {
    
    $error = json_encode(
        array(
            array(
                'stop' => 'run: sudo node node-apache-log/sock-monitor.js /var/log/httpd/bcmarinetrails-access_log >/dev/null 2>&1 &'
            )
        ));
    
    $jsonsock = 'monitor_sock.json';
    if (file_exists(__DIR__ . DS . $jsonsock)) {
        $json = json_decode(file_get_contents(__DIR__ . DS . $jsonsock));
        $pid = $json->pid;
        $cmd = 'ps -p ' . $pid . ' --no-headers';
        
        $data = trim(shell_exec($cmd));
        die($data);
        
        if (! empty($data)) {
            $psname = trim(substr($data, strripos($data, ' ')));
            if ($psname !== 'node') {
                echo $psname;
                return;
            }
        } else {
            echo $error;
            return;
        }
    } else {
        
        echo $error;
        return;
    }
    
    // shell_exec('cd '.__DIR__);
    // echo shell_exec('pwd');
    $cmd = 'node ' . escapeshellarg('node-apache-log/monitor-web.js') . ' ' . $id . ' 2>&1';
    echo shell_exec($cmd);
    // echo $cmd;
    
    return;
}

?>
<!DOCTYPE html>
<html>
<head>
<style type="text/css">
body {
	margin: 30px;
	margin-top: 65px;
	background-color: white;
	min-height: 100px;
	border-radius: 5px;
	border: 1px solid rgba(0, 0, 0, 0.06);
	height: calc(100% - 62px);
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

body:after {
	content: attr(data-state);
	display: inline-block;
	height: 50px;
	line-height: 45px;
	text-indent: 20px;
}

html {
	background-color: #f9f9f9;
	height: 100%;
}

body>div {
	padding: 10px;
	border-bottom: 1px solid rgba(0, 0, 0, 0.1);
	overflow-wrap: break-word;
}

.method-get {
	background-color: azure;
}

.method-post {
	background-color: papayawhip;
}

.client-error, .server-error {
	opacity: 0.7;
	text-decoration: line-through;
}

.client-error>span, .server-error.span {
	
}

.status-304 {
	padding: 2px 10px;
	font-size: 10px;
	color: darkgray;
}
</style>
<script type="text/javascript">
			(function(){

				var interval;
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
								if(line.stop){
									clearInterval(interval);
								}
								if(line.event==='access'){
									div.classList.add('method-'+(line.method.toLowerCase()));
									div.classList.add('status-'+line.status);
									div.classList.add('event-'+line.event);
									div.setAttribute('data-bytes', line.bytes);
									div.setAttribute('data-ip', line.ip);

									// received bytes
									var rec=line.received;
									var ru="B";
									if(rec>1024){
										rec=Math.round(rec/1024);
										ru="KB"
									}

									if(rec>1024){
										rec=Math.round(rec/1024);
										ru="MB"
									}



									// send bytes
									var bytes=line.bytes;
									var bu="B";
									if(bytes>1024){
										bytes=Math.round(bytes/1024);
										bu="KB"
									}

									if(bytes>1024){
										bytes=Math.round(bytes/1024);
										bu="MB"
									}

									var str=line.status+' '+line.method+': '+line.ip+' '+line.url+' in: '+rec+ru+' out: '+bytes+bu+' time: '+line.time+'μs';



									if(line.status==304){
										str+=' (cached)';
									}
									if(line.status>=400){
										str='<span>'+str+'</span>';
									}

									if(line.status>=400&&line.status<500){
										div.classList.add('client-error');
									}
									if(line.status>=500){
										div.classList.add('server-error');
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

				interval=setInterval(query, 1000);

			})();

		</script>
</head>
<body>
	<section id="apache-logs"></section>
</body>
</html>