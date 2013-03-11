// Requires carcass ~0.3.2
var carcass = require('carcass');

// Register factories.
carcass.register(__dirname, 'factories');

// Register instances.
carcass.register(__dirname, 'instances');

// Register applications.
carcass.register(__dirname, 'applications');
