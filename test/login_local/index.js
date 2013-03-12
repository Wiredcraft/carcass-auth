var carcass = require('carcass');

require('../../');

// Register applications.
carcass.register(__dirname, 'applications');

// Requires a local redis server.
var express = carcass.express;
var RedisStore = require('connect-redis')(express);

var server = new carcass.servers.Http();

server.mount('restify');
server.mount('session', {
    store: new RedisStore({
        prefix: 'carcass-auth-test:'
    })
});

module.exports = server;