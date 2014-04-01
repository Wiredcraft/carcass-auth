unsign = require('cookie-signature').unsign
carcass = require('carcass')
validValue = carcass.Object.validValue

###*
 * @return {Function} the helper.
###
module.exports = (options) ->
    validValue(options.secret)

    ###*
     * Just a helper.
     *
     * @return {String} the unsigned session ID.
    ###
    return decodeSID = (token) ->
        return if not token?
        # It is usually encoded.
        token = decodeURIComponent(token)
        # Connect prefixes it.
        token = token.slice(2) if token.indexOf('s:') is 0
        # Unsign.
        sessionID = unsign(token, options.secret)
        return if sessionID and sessionID isnt token then sessionID else null
