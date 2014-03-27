var RedisStore, carcass, cookieParser, express, lib, session, validValue;

lib = require('../');

carcass = require('carcass');

express = require('express');

session = require('express-session');

RedisStore = require('connect-redis')(session);

cookieParser = require('cookie-parser');

validValue = carcass.Object.validValue;


/**
 * Session and cookie.
 *
 * Just an example.
 */

module.exports = function(options) {
  var app, _ref;
  validValue(options.key);
  validValue(options.secret);

  /**
   * App.
   */
  app = express();

  /**
   * Cookie parser.
   */
  app.use(cookieParser(options.secret));

  /**
   * HTTP bearer can be used to override session id from cookie. API requests
   * will not have cookies so they need to provide session id in a different
   * way.
   */
  app.use(lib.middlewares.cookieBearer(options));
  app.use(session({
    key: options.key,
    store: new RedisStore((_ref = options.redis) != null ? _ref : {}),
    secret: options.secret,
    cookie: {
      path: '/',
      httpOnly: false,
      maxAge: null
    }
  }));

  /**
   * A shortcut to the encoded session id.
   */
  app.use(lib.middlewares.encodeSID(options));

  /**
   * API requests will not have cookies so they need to retrieve session id in
   * a different way.
   */
  app.get('/session', lib.middlewares.sendSession(options));
  return app;
};
