# node-apache-log
node-apache-log is a node.js utility to monitor an apache server by detecting log file updates. 
there are two utilities monitor.js and monitor-one.js both log client access by parsing changes to the apache access logs. 

The logger tool also maintains sqlite3 file databases for each vhost (storing access details), and could be used for analysis in the future (not available yet), as well as dynamic client/bot blacklisting.

When a client access an apache server url, the logger detects the monification to the log file, parses, and prints
a message to the terminal. 




requires node modules sqlite3, colors, and uses fs.watchFile. 


```
# will monitor a single apache log file
node monitor-one.js /path/to-apache_acces_log
```

```
# will detect all vhosts from apache conf files, and monitor all vhosts
node monitor.js
```


Example output:

```
206.87.52.180: wiki.geolive.s54.ok.ubc.ca, Vancouver, British Columbia, Canada /var/log/httpd/wiki.geolive-access_log
Request: GET /index.php/Development, Status: 200, Sent: 7.7kb
Request: GET /images/0/0c/MapComponents.png, Status: 304, Sent: 0b
...

206.87.52.180: geolive.s54.ok.ubc.ca, Vancouver, British Columbia, Canada /var/log/httpd/geolive-access_log
Request: GET /, Status: 200, Sent: 16.6kb
Request: GET /administrator/components/com_geolive/library/pushbox/pb-images.css, Status: 304, Sent: 0b
...

66.249.79.23: bcmarinetrails.s54.ok.ubc.ca /var/log/httpd/bcmarinetrails-access_log
Request: GET /kayaking_basics/equipment/choosing_a_paddle/, Status: 500, Sent: 0b

64.246.165.10: bcmarinetrails.s54.ok.ubc.ca /var/log/httpd/bcmarinetrails-access_log
Request: GET /robots.txt, Status: 200, Sent: 865b

66.207.115.161: bcmarinetrails.s54.ok.ubc.ca, Brantford, Ontario, Canada /var/log/httpd/bcmarinetrails-access_log
Request: GET /images/main_page_photos/download_campsites.jpg, Status: 200, Sent: 120.9kb
Request: GET /images/main_page_photos/one_the_trails_blog.jpg, Status: 200, Sent: 138.5kb
...

```
