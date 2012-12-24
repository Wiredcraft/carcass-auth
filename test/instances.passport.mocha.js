var carcass = require('carcass');
var should = require('should');

require('carcass-auth');

describe('The global passport instance', function() {
    var passport = carcass.instances.passport;

    it('should ba a same thing with the passport module.', function(done) {
        passport.should.be.a('object');
        passport.should.equal(require('passport'));
        done();
    });
});
