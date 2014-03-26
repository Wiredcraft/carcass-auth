unsign = require('cookie-signature').unsign
carcass = require('carcass')
validValue = carcass.Object.validValue

module.exports = (options) ->
    validValue(options.secret)
    secret = options.secret

    return unsignCookie = (token) ->
        return if not token?
        # It is usually encoded.
        token = decodeURIComponent(token)
        # Connect prefixes it.
        token = token.slice(2) if token.indexOf('s:') is 0
        # Unsign.
        sessionID = unsign(token, secret)
        return if sessionID and sessionID isnt token then sessionID else null
