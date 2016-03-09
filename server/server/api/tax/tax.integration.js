'use strict';

var app = require('../..');
import request from 'supertest';

var newTax;

describe('Tax API:', function() {

  describe('GET /api/taxes', function() {
    var taxs;

    beforeEach(function(done) {
      request(app)
        .get('/api/taxes')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          taxs = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      taxs.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/taxes', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/taxes')
        .send({
          name: 'New Tax',
          info: 'This is the brand new tax!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newTax = res.body;
          done();
        });
    });

    it('should respond with the newly created tax', function() {
      newTax.name.should.equal('New Tax');
      newTax.info.should.equal('This is the brand new tax!!!');
    });

  });

  describe('GET /api/taxes/:id', function() {
    var tax;

    beforeEach(function(done) {
      request(app)
        .get('/api/taxes/' + newTax._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          tax = res.body;
          done();
        });
    });

    afterEach(function() {
      tax = {};
    });

    it('should respond with the requested tax', function() {
      tax.name.should.equal('New Tax');
      tax.info.should.equal('This is the brand new tax!!!');
    });

  });

  describe('PUT /api/taxes/:id', function() {
    var updatedTax;

    beforeEach(function(done) {
      request(app)
        .put('/api/taxes/' + newTax._id)
        .send({
          name: 'Updated Tax',
          info: 'This is the updated tax!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedTax = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedTax = {};
    });

    it('should respond with the updated tax', function() {
      updatedTax.name.should.equal('Updated Tax');
      updatedTax.info.should.equal('This is the updated tax!!!');
    });

  });

  describe('DELETE /api/taxes/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/taxes/' + newTax._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when tax does not exist', function(done) {
      request(app)
        .delete('/api/taxes/' + newTax._id)
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
