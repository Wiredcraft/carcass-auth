var carcass, debug, validValue;

debug = require('debug')('carcass:middleware:cookieBearer');

carcass = require('carcass');

validValue = carcass.Object.validValue;

module.exports = function(options) {
  var cookieBearer;
  validValue(options.key);
  return cookieBearer = function(req, res, next) {
    var parts, token, _ref, _ref1;
    if (((_ref = req.headers) != null ? _ref.authorization : void 0) != null) {
      parts = req.headers.authorization.split(' ');
      if (parts.length === 2 && /^Bearer|Token$/i.test(parts[0])) {
        token = parts[1];
      }
    }
    if ((token == null) && (((_ref1 = req.query) != null ? _ref1.access_token : void 0) != null)) {
      token = req.query.access_token;
    }
    if (token != null) {
      token = decodeURIComponent(token);
      if (token.indexOf('s:') !== 0) {
        token = 's:' + token;
      }
      req.cookies[options.key] = token;
    }
    return next();
  };
};
