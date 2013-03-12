var debug = require('debug')('carcass-auth:test:Application:TestSession');

var carcass = require('carcass');

module.exports = carcass.factories.Express(function(app, options) {
    debug('initializing');

    app.use(function(req, res, next) {
        if (!req.session) {
            next(carcass.httpError(500, "session not found"));
        } else {
            next();
        }
    });
    app.get('/', function(req, res, next) {
        res.json(200, req.session || false);
    });
    app.get('/id', function(req, res, next) {
        res.json(200, req.sessionID || false);
    });
    app.get('/destroy', function(req, res, next) {
        req.session.destroy(function(err) {
            if (err) {
                return next(err);
            }
            if (req.session) {
                return next(carcass.httpError(500, "failed to destroy session"));
            }
            res.json(200, true);
        });
    });
});
