# node-apache-log
node-apache-log is a node.js utility to monitor an apache server by detecting log file updates. 
there are two utilities monitor.js and monitor-one.js both log client access by parsing changes to the apache access logs. 

The logger tool also maintains sqlite3 file databases for each vhost (storing access details), and could be used for analysis in the future (not available yet), as well as dynamic client/bot blacklisting.

requires node modules sqlite3, colors, and uses fs.watchFile. 


```
# will monitor a single apache log file
node monitor-one.js /path/to-apache_acces_log
```

```
# will detect all vhosts from apache conf files, and monitor all vhosts
node monitor.js
```
