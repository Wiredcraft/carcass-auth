// var debug = require('debug')('carcass:test');

var should = require('should');

var appendQS = require('../helpers/appendQS');

describe('Helper / appendQS:', function() {

    it('should be a function', function() {
        appendQS.should.be.type('function');
    });

    it('should work', function() {
        should.not.exist(appendQS());
    });

    it('should work', function() {
        appendQS('lorem').should.equal('lorem');
    });

    it('should work', function() {
        appendQS('lorem', 'ipsum').should.equal('lorem?ipsum');
    });

    it('should work', function() {
        appendQS('lorem', 'ipsum=true').should.equal('lorem?ipsum=true');
    });

    it('should work', function() {
        appendQS('lorem', {
            ipsum: true
        }).should.equal('lorem?ipsum=true');
    });

    it('should work', function() {
        appendQS('lorem?ipsum', 'dolor').should.equal('lorem?ipsum&dolor');
    });

    it('should work', function() {
        appendQS('lorem?ipsum=1', 'dolor=2').should.equal('lorem?ipsum=1&dolor=2');
    });

    it('should work', function() {
        appendQS('lorem?ipsum=1', {
            dolor: 2
        }).should.equal('lorem?ipsum=1&dolor=2');
    });

});
