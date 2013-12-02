var request = require('supertest'),
    should = require('should'),
    httpreqtest = require("../httpreqtest"),
    app = httpreqtest.server;


describe('GET /sample', function(){
  it('should return 200 expected JSON', function(done){
    request(app)
    .get('/sample?user=taro&age=22')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .end(function(err, res) {
      if (err) return done(err);

      res.body.header.host.should.match(/[^:]+:\d+/);
      res.body.url.should.equal('/sample?user=taro&age=22');
      res.body.query.user.should.equal('taro');
      res.body.query.age.should.equal('22');
      should.not.exists(res.body.body);
      done();
    });
  });
});


describe('POST /sample', function(){
  it('should return 200 expected JSON', function(done){
    request(app)
    .put('/sample')
    .send('user=taro&age=22')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .end(function(err, res) {
      if (err) return done(err);

      res.body.header.host.should.match(/[^:]+:\d+/);
      res.body.url.should.equal('/sample');
      res.body.should.have.property('query');
      res.body.body.user.should.equal('taro');
      res.body.body.age.should.equal('22');
      done();
    });
  });
});


describe('PUT /sample', function(){
  it('should return 200 expected JSON', function(done){
    request(app)
    .put('/sample')
    .send('user=taro&age=22')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .end(function(err, res) {
      if (err) return done(err);

      res.body.header.host.should.match(/[^:]+:\d+/);
      res.body.url.should.equal('/sample');
      res.body.should.have.property('query');
      res.body.body.user.should.equal('taro');
      res.body.body.age.should.equal('22');
      done();
    });
  });
});


describe('DELETE /sample', function(){
  it('should return 200 expected JSON', function(done){
    request(app)
    .del('/sample')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .end(function(err, res) {
      if (err) return done(err);

      res.body.header.host.should.match(/[^:]+:\d+/);
      res.body.url.should.equal('/sample');
      res.body.should.have.property('query');
      should.not.exists(res.body.body);
      done();
    });
  });
});


describe('HEAD /sample', function(){
  it('should return 405', function(done){
    request(app)
    .head('/sample')
    .expect(405, done);
  });
});

