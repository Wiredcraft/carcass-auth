lib = require('../')

module.exports = (options) ->
    helper = lib.helpers.encodeSID(options)

    return encodeSID = (req, res, next) ->
        req.encodedSID = helper(req.sessionID) if (req.sessionID)
        next()
