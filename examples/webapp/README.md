#webapp example

You can create a web interface for your apache monitor which uses sock-monitor.js and monitor-web.js.
If put this in a publicly accesible location you should make ensure that the page is secured using basic-auth or something otherwise private data could be exposed. 

requires node and composer

```

cd /path/to/document/root/
git clone https://github.com/nickolanack/node-apache-log.git
cp node-apache-log/examples/webapp/* .
/usr/local/bin/composer install
sudo node node-apache-log/sock-monitor.js /path/to/vhost-access_log >/dev/null 2>&1 &



```