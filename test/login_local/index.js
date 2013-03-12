var carcass = require('carcass');

require('../../');

require('../login_session');

// Register applications.
carcass.register(__dirname, 'applications');

// Requires a local redis server.
var express = carcass.express;
var RedisStore = require('connect-redis')(express);

var server = new carcass.servers.Http();

// Requires passport-local module (npm install passport-local).
var LocalStrategy = require('passport-local').Strategy;

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

module.exports = server;