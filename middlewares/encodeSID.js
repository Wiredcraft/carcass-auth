var lib;

lib = require('../');

module.exports = function(options) {
  var encodeSID, helper;
  helper = lib.helpers.encodeSID(options);
  return encodeSID = function(req, res, next) {
    if (req.sessionID) {
      req.encodedSID = helper(req.sessionID);
    }
    return next();
  };
};
