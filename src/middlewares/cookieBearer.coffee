debug = require('debug')('carcass:middleware:cookieBearer')

carcass = require('carcass')
validValue = carcass.Object.validValue

module.exports = (options) ->
    validValue(options.key)
    key = options.key

    return cookieBearer = (req, res, next) ->
        # Can be from headers.
        if req.headers?.authorization?
            parts = req.headers.authorization.split(' ')
            token = parts[1] if parts.length is 2 and /^Bearer|Token$/i.test(parts[0])
        # Can be from query.
        token = req.query.access_token if not token? and req.query?.access_token?
        # Can be from body.
        # TODO
        # Override token from cookie.
        if token?
            # It's usually encoded.
            token = decodeURIComponent(token)
            # ..
            token = 's:' + token if token.indexOf('s:') isnt 0
            # debug('overriding cookie %s with token %s', req.cookies[key], token)
            req.cookies[key] = token
        return next()
