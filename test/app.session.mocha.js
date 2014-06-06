var debug = require('debug')('carcass:test');

// var should = require('should');
var path = require('path');
var dir = path.resolve(__dirname, '../example');
var Monitor = require('carcass-monitor');
var supertest = require('supertest');
var CookieJar = require('cookiejar').CookieJar;
var CookieAccess = require('cookiejar').CookieAccessInfo;

describe('App / session:', function() {

    var request = supertest('http://127.0.0.1:3210');
    var access = CookieAccess('http://127.0.0.1:3210');
    var monitor = new Monitor();
    var jar = new CookieJar();
    var sid = null;
    var cookies = null;

    before(function(done) {
        monitor.stack({
            sourceDir: dir,
            script: 'program.js',
            options: ['-s', 'http'],
            startupMessage: 'listening'
        }).start(done);
    });

    after(function(done) {
        monitor.close(done);
    });

    it('should return a sid', function(done) {
        request.get('/session')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
                res.should.be.type('object').with.property('body').with.property('sid');
                sid = res.body.sid;
                debug('sid', sid);
                done();
            });
    });

    it('should return a different sid', function(done) {
        request.get('/session')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
                res.should.be.type('object').with.property('body').with.property('sid');
                res.body.sid.should.not.equal(sid);
                done();
            });
    });

    it('should return a same sid if we send a sid', function(done) {
        request.get('/session')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + sid)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
                res.should.be.type('object').with.property('body').with.property('sid');
                res.body.sid.should.equal(sid);
                done();
            });
    });

    it('should return a same sid if we send a sid', function(done) {
        request.get('/session')
            .set('Accept', 'application/json')
            .set('Authorization', 'Token ' + sid)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
                res.should.be.type('object').with.property('body').with.property('sid');
                res.body.sid.should.equal(sid);
                done();
            });
    });

    it('should return a same sid if we send a sid', function(done) {
        request.get('/session')
            .set('Accept', 'application/json')
            .query({
                access_token: sid
            })
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
                res.should.be.type('object').with.property('body').with.property('sid');
                res.body.sid.should.equal(sid);
                done();
            });
    });

    it('should return a new sid if we send a wrong sid', function(done) {
        request.get('/session')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer lorem')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
                res.should.be.type('object').with.property('body').with.property('sid');
                res.body.sid.should.not.equal('lorem');
                res.body.sid.should.not.equal(sid);
                done();
            });
    });

    it('should return a new sid if we send a wrong sid', function(done) {
        request.get('/session')
            .set('Accept', 'application/json')
            .set('Authorization', 'Token lorem')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
                res.should.be.type('object').with.property('body').with.property('sid');
                res.body.sid.should.not.equal('lorem');
                res.body.sid.should.not.equal(sid);
                done();
            });
    });

    it('should return a new sid if we send a wrong sid', function(done) {
        request.get('/session')
            .set('Accept', 'application/json')
            .query({
                access_token: 'lorem'
            })
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
                res.should.be.type('object').with.property('body').with.property('sid');
                res.body.sid.should.not.equal('lorem');
                res.body.sid.should.not.equal(sid);
                done();
            });
    });

    it('should return a new sid if we send in a wrong format', function(done) {
        request.get('/session')
            .set('Accept', 'application/json')
            .set('Authorization', 'lorem ' + sid)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
                res.should.be.type('object').with.property('body').with.property('sid');
                res.body.sid.should.not.equal('lorem');
                res.body.sid.should.not.equal(sid);
                done();
            });
    });

    it('should return a new sid if we send in a wrong format', function(done) {
        request.get('/session')
            .set('Accept', 'application/json')
            .query({
                lorem: sid
            })
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
                res.should.be.type('object').with.property('body').with.property('sid');
                res.body.sid.should.not.equal('lorem');
                res.body.sid.should.not.equal(sid);
                done();
            });
    });

    it('should return a sid with cookie', function(done) {
        request.get('/session')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect('set-cookie', /sid/)
            .end(function(err, res) {
                jar.setCookies(res.headers['set-cookie']);
                cookies = jar.getCookies(access).toValueString();
                done();
            });
    });

    it('should return a same sid if we send cookie', function(done) {
        var req = request.get('/session');
        req.cookies = cookies;
        req.set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
                res.should.be.type('object').with.property('body').with.property('sid');
                ('s%3A' + res.body.sid).should.equal(jar.getCookie('sid', access).value);
                done();
            });
    });

    it('should override cookie if we send a sid', function(done) {
        var req = request.get('/session');
        req.cookies = cookies;
        req.set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + sid)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
                res.should.be.type('object').with.property('body').with.property('sid');
                res.body.sid.should.equal(sid);
                done();
            });
    });

});
