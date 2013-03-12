var carcass = require('carcass');

require('../../');

// Setup session.
var server = require('../login_session');

// Register applications.
carcass.register(__dirname, 'applications');

// Requires passport-local module (npm install passport-local).
var LocalStrategy = require('passport-local').Strategy;

// Passport; a new instance.
// To use the global instance:
// var passport = carcass.instances.passport;
var passport = carcass.factories.Passport();

// Passport session setup.
// The callback will be invoked by req.logIn(), to serialize a user and save in
// the session.
// Here you need to make sure it is or becomes a JSON.
passport.serializeUser(function(user, done) {
    done(null, user);
});
// The callback will be invoked by the session strategy, to get a user from the
// session.
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

server.mount('passport', {
    passport: passport
});
server.mount('passportSession', {
    passport: passport
});
// Mount testSession again, after passport, to a different location.
server.mount('testSession', '/test/session/local');
server.mount('testPassportLocal', '/test/passport/local', {
    passport: passport
});

module.exports = server;
