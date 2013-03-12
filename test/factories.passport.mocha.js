var carcass = require('carcass');
var should = require('should');
var _ = require('underscore');

require('../');

describe('The Passport factory', function() {
    var Passport = carcass.factories.Passport;

    it('should be a function.', function() {
        Passport.should.be.a('function');
    });
});

describe('A passport instance', function() {
    var passport = carcass.factories.Passport();

    it('should be an object.', function() {
        passport.should.be.a('object');
        // Same attributes, but less.
        _.each(passport, function(attr, key) {
            require('passport').should.have.property(key);
        });
    });
});
