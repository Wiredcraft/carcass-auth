var debug = require('debug')('carcass-auth:Application:Passport:Session');

var carcass = require('carcass');

// Passport
// ---
// @see http://passportjs.org

// Enables session support.
// Requires Express session middleware.
// Requires passport.serializeUser() and passport.deserializeUser().
module.exports = carcass.factories.Express(function(app, options) {
    debug('initializing');

    options = options || {};

    var passport = options.passport || carcass.instances.passport;

    app.use(passport.session());
});
