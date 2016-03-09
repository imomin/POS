'use strict';

var app = require('../..');
import request from 'supertest';

var newDiscount;

describe('Discount API:', function() {

  describe('GET /api/discounts', function() {
    var discounts;

    beforeEach(function(done) {
      request(app)
        .get('/api/discounts')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          discounts = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      discounts.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/discounts', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/discounts')
        .send({
          name: 'New Discount',
          info: 'This is the brand new discount!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newDiscount = res.body;
          done();
        });
    });

    it('should respond with the newly created discount', function() {
      newDiscount.name.should.equal('New Discount');
      newDiscount.info.should.equal('This is the brand new discount!!!');
    });

  });

  describe('GET /api/discounts/:id', function() {
    var discount;

    beforeEach(function(done) {
      request(app)
        .get('/api/discounts/' + newDiscount._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          discount = res.body;
          done();
        });
    });

    afterEach(function() {
      discount = {};
    });

    it('should respond with the requested discount', function() {
      discount.name.should.equal('New Discount');
      discount.info.should.equal('This is the brand new discount!!!');
    });

  });

  describe('PUT /api/discounts/:id', function() {
    var updatedDiscount;

    beforeEach(function(done) {
      request(app)
        .put('/api/discounts/' + newDiscount._id)
        .send({
          name: 'Updated Discount',
          info: 'This is the updated discount!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedDiscount = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedDiscount = {};
    });

    it('should respond with the updated discount', function() {
      updatedDiscount.name.should.equal('Updated Discount');
      updatedDiscount.info.should.equal('This is the updated discount!!!');
    });

  });

  describe('DELETE /api/discounts/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/discounts/' + newDiscount._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when discount does not exist', function(done) {
      request(app)
        .delete('/api/discounts/' + newDiscount._id)
        .expect(404)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

  });

});
