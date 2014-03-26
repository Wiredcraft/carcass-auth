carcass = require('carcass')
sign = require('cookie-signature').sign
validValue = carcass.Object.validValue

module.exports = (options) ->
    validValue(options.secret)
    secret = options.secret

    return encodeSID = (req, res, next) ->
        if (req.sessionID)
            req.encodedSID = encodeURIComponent(sign(req.sessionID, secret))
        next()
