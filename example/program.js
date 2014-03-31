var lib, program;

lib = require('./');

module.exports = program = lib.getConsumer('Program');

program.registerScripts(lib.servers).bootstrap();
