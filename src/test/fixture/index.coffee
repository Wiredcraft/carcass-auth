auth = require('../../')
carcass = require('carcass')
config = require('carcass-config')
program = require('carcass-program')
extend = carcass.Object.extendProperties

# The lib.
module.exports = lib = carcass.mixable()
lib.mixin(carcass.proto.register)
lib.mixin(config.proto.manager)

# Register.
lib.register(__dirname, name) for name in ['applications', 'servers']

# Integrate.
lib.classes = {}
lib.helpers = {}
lib.middlewares = {}
extend(lib.classes, program.classes)
extend(lib.helpers, auth.helpers)
extend(lib.middlewares, auth.middlewares)

# Stack config files.
path = require('path')
lib.configDir(path.resolve(__dirname, 'configs')).initConfig()
