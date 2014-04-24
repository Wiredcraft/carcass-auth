var auth, carcass, config, lib, name, path, program, _i, _len, _ref;

auth = require('../');

carcass = require('carcass');

config = require('carcass-config');

program = require('carcass-program');

module.exports = lib = carcass.mixable();

lib.mixin(carcass.proto.register);

lib.mixin(config.proto.manager);

lib.extend(program, 'classes');

lib.extend(auth, 'helpers', 'middlewares');

_ref = ['applications', 'servers'];
for (_i = 0, _len = _ref.length; _i < _len; _i++) {
  name = _ref[_i];
  lib.register(__dirname, name);
}

path = require('path');

lib.configDir(path.resolve(__dirname, 'configs')).initConfig();
