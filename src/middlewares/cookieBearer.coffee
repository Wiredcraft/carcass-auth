debug = require('debug')('carcass:middleware:cookieBearer')

cookie = require('cookie')
carcass = require('carcass')
validValue = carcass.object.validValue

module.exports = (options) ->
    validValue(options.name)

    return cookieBearer = (req, res, next) ->
        # Can be from headers.
        if req.headers?.authorization?
            parts = req.headers.authorization.split(' ')
            token = parts[1] if parts.length is 2 and /^Bearer|Token$/i.test(parts[0])
        # Can be from query.
        token = req.query.access_token if not token? and req.query?.access_token?
        # Can be from body.
        # TODO
        # Override cookie.
        name = options.name
        if token?
            # It's usually encoded.
            token = decodeURIComponent(token)
            # ..
            token = 's:' + token if token.indexOf('s:') isnt 0
            # In order to work with express-session 1.5, we need to replace the
            # original cookie.
            if req.headers.cookie?
                cookies = req.cookies ? cookie.parse(req.headers.cookie)
                cookies[name] = token
                pairs = []
                for _name, _value of cookies
                    pairs.push(_name + '=' + encodeURIComponent(_value))
                req.headers.cookie = pairs.join(';')
            if req.cookies?
                # debug('overriding cookie %s with token %s', req.cookies[name], token)
                req.cookies[name] = token
            # Delete cookie so that the token will be used.
            if req.signedCookies? and req.signedCookies[name]?
                delete req.signedCookies[name]
        return next()
