var carcass, sign, validValue;

carcass = require('carcass');

sign = require('cookie-signature').sign;

validValue = carcass.object.validValue;

module.exports = function(options) {
  var encodeSID;
  validValue(options.secret);
  return encodeSID = function(sessionID) {
    return encodeURIComponent(sign(sessionID, options.secret));
  };
};
