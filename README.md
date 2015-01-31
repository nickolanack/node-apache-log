# node-apache-log
node-apache-log is a node.js utility to monitor an apache server by detecting log file updates. 
there are two utilities monitor.js and monitor-one.js both log client access by parsing changes to the apache access logs. 

The logger tool also maintains sqlite3 file databases for each vhost (storing access details), and could be used for analysis in the future (not available yet), as well as dynamic client/bot blacklisting.

When a client access an apache server url, the logger detects the monification to the log file, parses, and prints
a message to the terminal. 

Example output:

```
206.87.52.180: wiki.geolive.s54.ok.ubc.ca, Vancouver, British Columbia, Canada /var/log/httpd/wiki.geolive-access_log
Request: GET /index.php/Development, Status: 200, Sent: 7.7kb
Request: GET /images/0/0c/MapComponents.png, Status: 304, Sent: 0b
Request: GET /skins/common/images/poweredby_mediawiki_88x31.png, Status: 304, Sent: 0b
Request: GET /load.php?debug=false&lang=en&modules=mediawiki.legacy.commonPrint%2Cshared%7Cskins.vector&only=styles&skin=vector&*, Status: 304, Sent: 20b
Request: GET /images/geolive_wiki.png, Status: 304, Sent: 0b
Request: GET /load.php?debug=false&lang=en&modules=startup&only=scripts&skin=vector&*, Status: 200, Sent: 2.1kb
Request: GET /load.php?debug=false&lang=en&modules=jquery%7Cmediawiki&only=scripts&skin=vector&version=20111124T212140Z, Status: 304, Sent: 20b

206.87.52.180: geolive.s54.ok.ubc.ca, Vancouver, British Columbia, Canada /var/log/httpd/geolive-access_log
Request: GET /, Status: 200, Sent: 16.6kb
Request: GET /administrator/components/com_geolive/library/pushbox/pb-images.css, Status: 304, Sent: 0b
Request: GET /modules/mod_hs_users/tmpl/css/mod_hs_users.css, Status: 304, Sent: 0b
Request: GET /media/jui/js/jquery.min.js, Status: 304, Sent: 0b
Request: GET /administrator/components/com_geolive/library/pushbox/pb.css, Status: 304, Sent: 0b
Request: GET /administrator/components/com_geolive/library/spinner/spin.css, Status: 304, Sent: 0b
Request: GET /templates/geolive/css/bootstrap.css, Status: 304, Sent: 0b
Request: GET /media/jui/js/jquery-noconflict.js, Status: 304, Sent: 0b

```


requires node modules sqlite3, colors, and uses fs.watchFile. 


```
# will monitor a single apache log file
node monitor-one.js /path/to-apache_acces_log
```

```
# will detect all vhosts from apache conf files, and monitor all vhosts
node monitor.js
```
