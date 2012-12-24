var carcass = require('carcass');
var request = require('request');
var should = require('should');

require('./fixture');

var server = new carcass.servers.Http();

// Requires a local redis server.
var express = require('express');
var RedisStore = require('connect-redis')(express);

// Requires passport-local module (npm install passport-local).
var LocalStrategy = require('passport-local').Strategy;

// Test URLs.
var url_root = 'http://127.0.0.1:3000';
var url_session = url_root + '/test/session';
var url_session_id = url_session + '/id';
var url_session_destroy = url_session + '/destroy';
var url_local = url_root + '/test/passport/local';
var url_local_login = url_local + '/login';
var url_local_logout = url_local + '/logout';

var sessionID;

describe('Passport with the Local strategy', function() {

    before(function(done) {
        // Passport; a new instance.
        // To use the global instance:
        // var passport = carcass.instances.passport;
        var passport = carcass.factories.Passport();

        // Passport session setup.
        // The callback will be invoked by req.logIn(), to serialize a user and
        // save in the session.
        // Here you need to make sure it is or becomes a JSON.
        passport.serializeUser(function(user, done) {
            done(null, user);
        });
        // The callback will be invoked by the session strategy, to get a user
        // from the session.
        // Here you can convert it back to a model.
        passport.deserializeUser(function(obj, done) {
            done(null, obj);
        });

        // Use a local strategy.
        passport.use('local', new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: false
        }, function(username, password, done) {
            // TODO: verify user and pass.
            done(null, {
                username: 'root',
                email: 'root@example.com'
            });
        }));

        server.mount('restify');
        server.mount('session', {
            store: new RedisStore({
                prefix: 'carcass-auth-test:'
            })
        });
        server.mount('passport', {
            passport: passport
        });
        server.mount('passportSession', {
            passport: passport
        });
        server.mount('testSession', '/test/session');
        server.mount('testPassportLocal', '/test/passport/local', {
            passport: passport
        });
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
            }, function(err, res, body) {
                should.not.exist(err);
                res.should.be.a('object');
                res.should.have.property('statusCode', 200);
                body.should.be.a('object');
                body.should.have.property('cookie');
                body.should.have.property('passport');
                body.passport.should.have.property('user');
                body.passport.user.should.have.property('username');
                body.passport.user.should.have.property('email');
                body.passport.user.should.not.have.property('password');
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
