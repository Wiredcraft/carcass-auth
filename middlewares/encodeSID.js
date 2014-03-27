var carcass, sign, validValue;

carcass = require('carcass');

sign = require('cookie-signature').sign;

validValue = carcass.Object.validValue;

module.exports = function(options) {
  var encodeSID;
  validValue(options.secret);
  return encodeSID = function(req, res, next) {
    if (req.sessionID) {
      req.encodedSID = encodeURIComponent(sign(req.sessionID, options.secret));
    }
    return next();
  };
};
