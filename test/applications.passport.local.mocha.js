var carcass = require('carcass');
var request = require('request');
var should = require('should');

var server = require('./login_local');

// Test URLs.
var url_root = 'http://127.0.0.1:3000';
var url_session = url_root + '/test/session/local';
var url_session_id = url_session + '/id';
var url_session_destroy = url_session + '/destroy';
var url_local = url_root + '/test/passport/local';
var url_local_login = url_local + '/login';
var url_local_logout = url_local + '/logout';

var sessionID;

describe('Passport with the Local strategy', function() {

    before(function(done) {
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
                // There's passport but no user.
                body.should.have.property('passport');
                body.passport.should.not.have.property('user');
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

    // Login.
    describe('POST ' + url_local_login, function() {
        it('should login and return the session.', function(done) {
            request.post({
                uri: url_local_login,
                json: true,
                body: {
                    username: 'root',
                    password: 'test'
                }
            }, function(err, res, session) {
                should.not.exist(err);
                res.should.be.a('object');
                res.should.have.property('statusCode', 200);
                session.should.be.a('object');
                session.should.have.property('cookie');
                session.should.have.property('passport');
                session.passport.should.have.property('user');
                session.passport.user.should.have.property('username');
                session.passport.user.should.have.property('email');
                session.passport.user.should.have.property('password');
                setTimeout(done, 1);
            });
        });
    });

    describe('GET ' + url_session_id, function() {
        it('should return the same sessionID as before login', function(done) {
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

    // Logout.
    describe('POST ' + url_local_logout, function() {
        it('should logout and return true', function(done) {
            request.post({
                uri: url_local_logout,
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
                // There's passport but no user.
                body.should.have.property('passport');
                body.passport.should.not.have.property('user');
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
