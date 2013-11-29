httpreqtest
===========
[![Build Status](https://travis-ci.org/tilfin/httpreqtest.png)](https://travis-ci.org/tilfin/httpreqtest)

HTTP request test server for Node.js


Motivation
----------
This is a very simple HTTP server that echos http request as json to a client.

For example, you make a client against a HTTP API service. you often want to check whether your client calls right http requests required some API specification.

The response JSON has fields are 'header', 'url', 'query' and 'body'.
The 'header' has http request headers. The 'url' is a http request path with the query. The 'query' has a request query parameter map. The 'body' has a paramter map parsed a POST/PUT request body for 'x-www-form-urlencoded'.

The server also outputs formed these data at the console.


How to use
----------
You need node and only 'httpreqtest.js'.

Start the test server:

    $ node httpreqtest.js

Usage:

    $ node httpreqtest.js -h
    Usage node httpreqtest.js [options]
    
    Options:
      -h           print help
      -p port      bind port
      -b hostname  bind hostname

Try to call any http requests to the server from your client...

###Example

####GET
Get test by curl:

    $ curl http://localhost:8080/sample?user=Mike
    {"header":{"user-agent":"curl/7.30.0","host":"localhost:8080","accept":"*/*"},"url":"/sample?user=Mike","query":{"user":"Mike"}}

Server console:

	GET /sample?user=Mike
	
	## Response Body
	{ header:
	   { 'user-agent': 'curl/7.30.0',
	     host: 'localhost:8080',
	     accept: '*/*' },
	  url: '/sample?user=Mike',
	  query: { user: 'Mike' } }

####POST
Post test by curl:

    $ curl -d "user=taro&age=22" http://localhost:8080/sample
    {"header":{"user-agent":"curl/7.30.0","host":"localhost:8080","accept":"*/*","content-length":"16","content-type":"application/x-www-form-urlencoded"},"url":"/sample","query":{},"body":{"user":"taro","age":"22"}}

Server console:

	POST /sample
	[Body]
	user=taro&age=22
	[/Body]
	
	## Response Body
	{ header:
	   { 'user-agent': 'curl/7.30.0',
	     host: 'localhost:8080',
	     accept: '*/*',
	     'content-length': '16',
	     'content-type': 'application/x-www-form-urlencoded' },
	  url: '/sample',
	  query: {},
	  body: { user: 'taro', age: '22' } }


License
-------
MIT
