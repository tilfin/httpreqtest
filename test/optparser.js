var assert = require('assert'),
    httpreqtest = require("../httpreqtest"),
    optParser = httpreqtest.optParser;


function captureStream(stream){
  var oldWrite = stream.write;
  var buf = '';
  stream.write = function(chunk, encoding, callback){
    buf += chunk.toString(); // chunk is a String or Buffer
    oldWrite.apply(stream, arguments);
  }

  return {
    unhook: function unhook(){
     stream.write = oldWrite;
    },
    captured: function(){
      return buf;
    }
  };
}


describe('optParser', function(){
  var hook;
  beforeEach(function(){
    hook = captureStream(process.stdout);
  });
  afterEach(function(){
    hook.unhook(); 
  });

  describe('command argvs -h', function(){
    it('should return usage', function(){
      var exp = "Usage node httpreqtest.js [options]\n\n" +
                "Options:\n" +
                "  -h           print help\n" +
                "  -p port      bind port\n" +
                "  -b hostname  bind hostname";

      process.exit = function(code){
        assert.equal(code, 1);
      }

      process.argv = ["node", "httpreqtest.js", "-h"];
      optParser();

      setTimeout(function(){
        assert.equal(hook.captured(), exp);
        done();
      }, 2000);
    });
  });

  describe('command argv -p port', function(){
    it('should return param.port is specified', function(){
      process.argv = ["node", "httpreqtest.js", "-p", "9999"];
      var param = optParser();
      assert.equal(param.port, 9999);
    });
  });

  describe('command argv -b host', function(){
    it('should return param.host is specified', function(){
      process.argv = ["node", "httpreqtest.js", "-b", "10.0.0.10"];
      var param = optParser();
      assert.equal(param.host, "10.0.0.10");
    });
  });

  describe('command argv -p port -b host', function(){
    it('should return params are specified', function(){
      process.argv = ["node", "httpreqtest.js", "-b", "10.0.0.1", "-p", "8888"];
      var param = optParser();
      assert.equal(param.host, "10.0.0.1");
      assert.equal(param.port, "8888");
    });
  });
});

