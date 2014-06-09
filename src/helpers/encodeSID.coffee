carcass = require('carcass')
sign = require('cookie-signature').sign
validValue = carcass.object.validValue

module.exports = (options) ->
    validValue(options.secret)

    return encodeSID = (sessionID) ->
        return encodeURIComponent(sign(sessionID, options.secret))
