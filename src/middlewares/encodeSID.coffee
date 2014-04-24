carcass = require('carcass')
sign = require('cookie-signature').sign
validValue = carcass.object.validValue

module.exports = (options) ->
    validValue(options.secret)

    return encodeSID = (req, res, next) ->
        if (req.sessionID)
            req.encodedSID = encodeURIComponent(sign(req.sessionID, options.secret))
        next()
