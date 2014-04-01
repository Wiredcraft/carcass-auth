var appendQS, qs;

qs = require('qs');


/**
 * Just a helper.
 *
 * @return {String} the URL with the val appended.
 */

module.exports = appendQS = function(url, val) {
  if (url == null) {
    return;
  }
  if (val == null) {
    return url;
  }
  if (typeof val !== 'string') {
    val = qs.stringify(val);
  }
  if (!val.length) {
    return url;
  }
  return url + (~url.indexOf('?') ? '&' : '?') + val;
};
