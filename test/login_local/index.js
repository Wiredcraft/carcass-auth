var carcass = require('carcass');
var passwordHash = require('password-hash');

require('../../');

var users = [
    { id: 1, username: 'bob', password: 'secret', email: 'bob@example.com' }
  , { id: 2, username: 'joe', password: 'birthday', email: 'joe@example.com' }
  , { id: 3, username: 'root', password: 'test', email: 'root@example.com' }
];

for(var i = 0; i<users.length; i++) {
    users[i].password = passwordHash.generate(users[i].password);
};

function findByUsername(username, fn) {
    for (var i = 0, len = users.length; i < len; i++) {
        var user = users[i];
        if (user.username === username) {
            return fn(null, user);
        }
    }
  return fn(null, null);
}

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
    // Verify user and pass.
    findByUsername(username, function(err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false, {message: 'Unknow user ' + user.name }); }
        if (!passwordHash.verify(password, user.password)) {   
            return done(null, false, { message: 'Invalid password' });
        }
        return done(null, user);
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
