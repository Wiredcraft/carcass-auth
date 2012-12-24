var carcass = require('carcass');
var should = require('should');
var _ = require('underscore');

require('carcass-auth');

describe('The Passport factory', function() {
    var Passport = carcass.factories.Passport;

    it('should be a function.', function(done) {
        Passport.should.be.a('function');
        done();
    });
});

describe('A passport instance', function() {
    var passport = carcass.factories.Passport();

    it('should be an object.', function(done) {
        passport.should.be.a('object');
        // Same attributes, but less.
        _.each(passport, function(attr, key) {
            require('passport').should.have.property(key);
            require('passport')[key].should.eql(attr);
        });
        done();
    });
});
