var debug = require('debug')('carcass:test');

var should = require('should');
var lib = require('./fixture');
var path = require('path');
var dir = path.resolve(__dirname, 'fixture');
var Monitor = require('carcass-monitor');
var supertest = require('supertest');

var unsignCookie = require('../helpers/unsignCookie');

describe('Helper / unsignCookie:', function() {

    var unsign = null;
    var request = supertest('http://127.0.0.1:3210');
    var monitor = new Monitor();
    var sid = null;

    before(function(done) {
        lib.reload(done);
    });

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

    it('should be a function', function() {
        unsignCookie.should.be.type('function');
    });

    it('should return a function', function() {
        unsign = unsignCookie(lib.get('session'));
        unsign.should.be.type('function');
    });

    it('prepare a sid', function(done) {
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

    it('should unsign a sid', function() {
        var sessionID = unsign(sid);
        sessionID.should.be.type('string');
    });

    it('should unsign a sid', function() {
        var sessionID = unsign('s:' + sid);
        sessionID.should.be.type('string');
    });

    it('should not unsign nothing', function() {
        var sessionID = unsign();
        should.not.exist(sessionID);
    });

    it('should not unsign a wrong sid', function() {
        var sessionID = unsign('lorem:' + sid);
        should.not.exist(sessionID);
    });

    it('should not unsign a wrong sid', function() {
        var sessionID = unsign(sid.slice(0, -1));
        should.not.exist(sessionID);
    });

    it('should not unsign a result', function() {
        var sessionID = unsign(sid);
        sessionID = unsign(sessionID);
        should.not.exist(sessionID);
    });

});