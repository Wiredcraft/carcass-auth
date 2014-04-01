var debug = require('debug')('carcass:test');

var should = require('should');
var path = require('path');
var dir = path.resolve(__dirname, '../example');
var example = require('../example');
var Monitor = require('carcass-monitor');
var supertest = require('supertest');

var decodeSID = require('../helpers/decodeSID');

describe('Helper / decodeSID:', function() {

    var decode = null;
    var request = supertest('http://127.0.0.1:3210');
    var monitor = new Monitor();
    var sid = null;

    before(function(done) {
        example.reload(done);
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
        decodeSID.should.be.type('function');
    });

    it('should return a function', function() {
        decode = decodeSID(example.get('session'));
        decode.should.be.type('function');
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

    it('should decode a sid', function() {
        var sessionID = decode(sid);
        sessionID.should.be.type('string');
    });

    it('should decode a sid', function() {
        var sessionID = decode('s:' + sid);
        sessionID.should.be.type('string');
    });

    it('should not decode nothing', function() {
        var sessionID = decode();
        should.not.exist(sessionID);
    });

    it('should not decode a wrong sid', function() {
        var sessionID = decode('lorem:' + sid);
        should.not.exist(sessionID);
    });

    it('should not decode a wrong sid', function() {
        var sessionID = decode(sid.slice(0, -1));
        should.not.exist(sessionID);
    });

    it('should not decode a result', function() {
        var sessionID = decode(sid);
        sessionID = decode(sessionID);
        should.not.exist(sessionID);
    });

});
