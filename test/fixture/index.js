var auth, carcass, config, extend, lib, name, path, program, _i, _len, _ref;

auth = require('../../');

carcass = require('carcass');

config = require('carcass-config');

program = require('carcass-program');

extend = carcass.Object.extendProperties;

module.exports = lib = carcass.mixable();

lib.mixin(carcass.proto.register);

lib.mixin(config.proto.manager);

_ref = ['applications', 'servers'];
for (_i = 0, _len = _ref.length; _i < _len; _i++) {
  name = _ref[_i];
  lib.register(__dirname, name);
}

lib.classes = {};

lib.helpers = {};

lib.middlewares = {};

extend(lib.classes, program.classes);

extend(lib.helpers, auth.helpers);

extend(lib.middlewares, auth.middlewares);

path = require('path');

lib.configDir(path.resolve(__dirname, 'configs')).initConfig();
