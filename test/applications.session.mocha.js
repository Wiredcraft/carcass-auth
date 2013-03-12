var carcass = require('carcass');
var request = require('request');
var should = require('should');

require('./fixture/login_session');

var server = new carcass.servers.Http();

// Requires a local redis server.
var express = carcass.express;
var RedisStore = require('connect-redis')(express);

// Test URLs.
var url_root = 'http://127.0.0.1:3000';
var url_session = url_root + '/test/session';
var url_session_id = url_session + '/id';
var url_session_destroy = url_session + '/destroy';

var sessionID;

describe('Session', function() {
    before(function(done) {
        server.mount('restify');
        server.mount('session', {
            store: new RedisStore({
                prefix: 'carcass-auth-test:'
            })
        });
        server.mount('testSession', '/test/session');
        server.start(done);
    });

    after(function(done) {
        server.close(done);
    });

    // Cleanup.
    describe('GET ' + url_session_destroy, function() {
        it('should return true', function(done) {
            request.get({
                uri: url_session_destroy,
                json: true
            }, function(err, res, body) {
                should.not.exist(err);
                res.should.be.a('object');
                res.should.have.property('statusCode', 200);
                body.should.equal(true);
                setTimeout(done, 1);
            });
        });
    });

    // Session is always there.
    describe('GET ' + url_session, function() {
        it('should return the session', function(done) {
            request.get({
                uri: url_session,
                json: true
            }, function(err, res, body) {
                should.not.exist(err);
                res.should.be.a('object');
                res.should.have.property('statusCode', 200);
                body.should.be.a('object');
                body.should.have.property('cookie');
                setTimeout(done, 1);
            });
        });
    });

    describe('GET ' + url_session_id, function() {
        it('should return the sessionID', function(done) {
            request.get({
                uri: url_session_id,
                json: true
            }, function(err, res, body) {
                should.not.exist(err);
                res.should.be.a('object');
                res.should.have.property('statusCode', 200);
                body.should.be.ok;
                sessionID = body;
                setTimeout(done, 1);
            });
        });
    });

    describe('GET ' + url_session_id, function() {
        it('should return the same sessionID with multiple requests', function(
            done) {
            request.get({
                uri: url_session_id,
                json: true
            }, function(err, res, body) {
                should.not.exist(err);
                res.should.be.a('object');
                res.should.have.property('statusCode', 200);
                body.should.equal(sessionID);
                setTimeout(done, 1);
            });
        });
    });

    // Destroy.
    describe('GET ' + url_session_destroy, function() {
        it('should return true', function(done) {
            request.get({
                uri: url_session_destroy,
                json: true
            }, function(err, res, body) {
                should.not.exist(err);
                res.should.be.a('object');
                res.should.have.property('statusCode', 200);
                body.should.equal(true);
                setTimeout(done, 1);
            });
        });
    });

    // Session is always there.
    describe('GET ' + url_session, function() {
        it('should return the session', function(done) {
            request.get({
                uri: url_session,
                json: true
            }, function(err, res, body) {
                should.not.exist(err);
                res.should.be.a('object');
                res.should.have.property('statusCode', 200);
                body.should.be.a('object');
                body.should.have.property('cookie');
                setTimeout(done, 1);
            });
        });
    });

    // Session ID is changed.
    describe('GET ' + url_session_id, function() {
        it('should return a different sessionID', function(done) {
            request.get({
                uri: url_session_id,
                json: true
            }, function(err, res, body) {
                should.not.exist(err);
                res.should.be.a('object');
                res.should.have.property('statusCode', 200);
                body.should.be.ok;
                body.should.not.eql(sessionID);
                setTimeout(done, 1);
            });
        });
    });

    // Cleanup.
    describe('GET ' + url_session_destroy, function() {
        it('should return true', function(done) {
            request.get({
                uri: url_session_destroy,
                json: true
            }, function(err, res, body) {
                should.not.exist(err);
                res.should.be.a('object');
                res.should.have.property('statusCode', 200);
                body.should.equal(true);
                setTimeout(done, 1);
            });
        });
    });
});
