var debug, express, http, lib, server;

debug = require('debug')('carcass:server:http');

lib = require('../');

http = require('http');

express = require('express');


/**
 * HTTP server.
 *
 * Just an example.
 */

module.exports = server = lib.getConsumer('Server', 'http');


/**
 * Start.
 */

server.start = function(program, done) {
  var config, port, process, _ref;
  config = this.config();
  process = program.process();
  port = (_ref = config != null ? config.port : void 0) != null ? _ref : 3000;
  server = http.createServer(this.app());
  debug('starting http server on %s.', port);
  server.on('listening', function() {
    if (process != null) {
      if (typeof process.send === "function") {
        process.send({
          listening: true
        });
      }
    }
    return done();
  });
  return server.listen(port);
};


/**
 * Helper.
 */

server.app = function() {
  var app, config, manager;
  app = express();
  config = this.config();
  manager = this.configManager();
  if ((config != null ? config.dev : void 0) != null) {
    app.use(express.logger({
      format: 'dev'
    }));
  }
  app.use(express.json());
  app.use(express.urlencoded());
  app.use(lib.applications.session(manager.get('session')));
  app.use(express.errorHandler());
  return app;
};
