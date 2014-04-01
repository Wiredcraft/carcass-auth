var carcass, unsign, validValue;

unsign = require('cookie-signature').unsign;

carcass = require('carcass');

validValue = carcass.Object.validValue;


/**
 * @return {Function} the helper.
 */

module.exports = function(options) {
  var decodeSID;
  validValue(options.secret);

  /**
   * Just a helper.
   *
   * @return {String} the unsigned session ID.
   */
  return decodeSID = function(token) {
    var sessionID;
    if (token == null) {
      return;
    }
    token = decodeURIComponent(token);
    if (token.indexOf('s:') === 0) {
      token = token.slice(2);
    }
    sessionID = unsign(token, options.secret);
    if (sessionID && sessionID !== token) {
      return sessionID;
    } else {
      return null;
    }
  };
};
