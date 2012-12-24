var debug = require('debug')('carcass-auth:Instance:Passport');

var carcass = require('carcass');

// Passport
// ---
// Singleton; exports an instance.

// Simply export the passport module; no need to build from the factory until
// now.
module.exports = require('passport');
