qs = require('qs')

###*
 * Just a helper.
 *
 * @return {String} the URL with the val appended.
###
module.exports = appendQS = (url, val) ->
    return if not url?
    return url if not val?
    val = qs.stringify(val) if typeof val isnt 'string'
    return url if not val.length
    return url + (if ~url.indexOf('?') then '&' else '?') + val
