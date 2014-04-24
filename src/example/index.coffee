auth = require('../')
carcass = require('carcass')
config = require('carcass-config')
program = require('carcass-program')

# The lib.
module.exports = lib = carcass.mixable()
lib.mixin(carcass.proto.register)
lib.mixin(config.proto.manager)

# Integrate.
lib.extend(program, 'classes')
lib.extend(auth, 'helpers', 'middlewares')

# Register.
lib.register(__dirname, name) for name in ['applications', 'servers']

# Stack config files.
path = require('path')
lib.configDir(path.resolve(__dirname, 'configs')).initConfig()
