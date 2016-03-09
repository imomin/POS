'use strict';

var app = require('../..');
import request from 'supertest';

var newStore;

describe('Store API:', function() {

  describe('GET /api/store', function() {
    var stores;

    beforeEach(function(done) {
      request(app)
        .get('/api/store')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          stores = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      stores.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/store', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/store')
        .send({
          name: 'New Store',
          info: 'This is the brand new store!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newStore = res.body;
          done();
        });
    });

    it('should respond with the newly created store', function() {
      newStore.name.should.equal('New Store');
      newStore.info.should.equal('This is the brand new store!!!');
    });

  });

  describe('GET /api/store/:id', function() {
    var store;

    beforeEach(function(done) {
      request(app)
        .get('/api/store/' + newStore._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          store = res.body;
          done();
        });
    });

    afterEach(function() {
      store = {};
    });

    it('should respond with the requested store', function() {
      store.name.should.equal('New Store');
      store.info.should.equal('This is the brand new store!!!');
    });

  });

  describe('PUT /api/store/:id', function() {
    var updatedStore;

    beforeEach(function(done) {
      request(app)
        .put('/api/store/' + newStore._id)
        .send({
          name: 'Updated Store',
          info: 'This is the updated store!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedStore = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedStore = {};
    });

    it('should respond with the updated store', function() {
      updatedStore.name.should.equal('Updated Store');
      updatedStore.info.should.equal('This is the updated store!!!');
    });

  });

  describe('DELETE /api/store/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/store/' + newStore._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when store does not exist', function(done) {
      request(app)
        .delete('/api/store/' + newStore._id)
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
