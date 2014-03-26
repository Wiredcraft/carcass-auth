var carcass, sign, validValue;

carcass = require('carcass');

sign = require('cookie-signature').sign;

validValue = carcass.Object.validValue;

module.exports = function(options) {
  var encodeSID, secret;
  validValue(options.secret);
  secret = options.secret;
  return encodeSID = function(req, res, next) {
    if (req.sessionID) {
      req.encodedSID = encodeURIComponent(sign(req.sessionID, secret));
    }
    return next();
  };
};
