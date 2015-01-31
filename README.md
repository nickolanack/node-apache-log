# node-apache-log
and node.js utility to monitor the apache server logs. monitors the log files and prints changes to the console. also reverse geocodes ip addresses

requires node modules sqlite3, colors, and uses fs.watchFile. 


```
# will monitor a single apache log file
node monitor-one.js /path/to-apache_acces_log
```

```
# will detect all vhosts from apache conf files, and monitor all vhosts
node monitor.js
```
