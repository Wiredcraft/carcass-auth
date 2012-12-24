var debug = require('debug')('carcass-auth:Application:Passport');

var carcass = require('carcass');

// Passport
// ---
// @see http://passportjs.org
module.exports = carcass.factories.Express(function(app, options) {
    debug('initializing');

    options = options || {};

    var passport = options.passport || carcass.instances.passport;

    app.use(passport.initialize());
});
