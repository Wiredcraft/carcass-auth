var debug = require('debug')('carcass-auth:Factory:Passport');

var carcass = require('carcass');
var passport = require('passport');

// Passport
// ---
// Concrete factory; returns an instance.

// The passport module exports a global instance by itself. So this is not
// really useful except for testing or multiple instances.
module.exports = function(args) {
    debug('building');

    // .
    var Passport = passport.Passport;

    // .
    var instance = new Passport();

    return instance;
};
