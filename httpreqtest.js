/*
The MIT License (MIT)

Copyright (c) 2013 Toshimitsu Takahashi

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

var http = require('http');
var URL  = require('url');
var querystring = require('querystring');


function sendJson(res, statusCode, entity){
  var json, code = statusCode;
  try {
    json = JSON.stringify(entity);
  } catch(err) {
    code = 500;
    json = '{"message":"Broken content"}';
  }

  res.writeHead(code, { 'Content-Length': Buffer.byteLength(json, 'utf8'),
                        'Content-Type': 'application/json;charset=utf8' });
  res.end(json);
}


function usage(){
  console.log("Usage node httpreqtest.js [options]\n\n" +
              "Options:\n" +
              "  -h           print help\n" + 
              "  -p port      bind port\n" +
              "  -b hostname  bind hostname");
  process.exit(1);
}


function optParser(){
  var port = 8080;
  var host = undefined;

  for (var i = 2; i < process.argv.length; i++) {
    var sp = process.argv[i]
    if (sp === "-h") {
      usage();
    } else if (sp === "-p") {
      port = parseInt(process.argv[++i], 10);
    } else if (sp === "-b") {
      host = process.argv[++i];
    }
  }

  if (isNaN(port)) usage();

  return { host: host, port: port };
}


var server = http.createServer(function(req, res){
  const LOG_END = "\n\n";

  var request = URL.parse(req.url, true);

  console.log(req.method + " " + request.href);

  var resbody = {
    header: req.headers,
    url  : req.url,
    query: request.query,
  };

  if (req.method === 'GET' || req.method === 'HEAD'
      || req.method == 'DELETE') {
    sendJson(res, 200, resbody);
    console.log("\n## Response Body");
    console.log(resbody);
    console.log(LOG_END);

  } else if (req.method === 'POST' || req.method == 'PUT') {
    var body = '';
    req.on('data', function(data){
      body += data;
    }).on('end', function(){
      console.log("[Body]");
      console.log(body);
      console.log("[/Body]");

      resbody.body = querystring.parse(body);
      sendJson(res, 200, resbody);

      console.log("\n## Response Body");
      console.log(resbody);
      console.log(LOG_END);
    });

  } else {
    sendJson(res, 405, resbody);
    console.log("\n## Response Body");
    console.log(resbody);
    console.log(LOG_END);
  }
});


if (module.parent) {
  exports.server = server;
  exports.optParser = optParser;
} else {
  var param = optParser();
  server.listen(param.port, param.host);
  console.log("Start listening %s port: %d", param.host || "", param.port);
}

