'use strict';

var app = require('../..');
import request from 'supertest';

var newMerchandisecode;

describe('Merchandisecode API:', function() {

  describe('GET /api/merchandisecodes', function() {
    var merchandisecodes;

    beforeEach(function(done) {
      request(app)
        .get('/api/merchandisecodes')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          merchandisecodes = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      merchandisecodes.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/merchandisecodes', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/merchandisecodes')
        .send({
          name: 'New Merchandisecode',
          info: 'This is the brand new merchandisecode!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newMerchandisecode = res.body;
          done();
        });
    });

    it('should respond with the newly created merchandisecode', function() {
      newMerchandisecode.name.should.equal('New Merchandisecode');
      newMerchandisecode.info.should.equal('This is the brand new merchandisecode!!!');
    });

  });

  describe('GET /api/merchandisecodes/:id', function() {
    var merchandisecode;

    beforeEach(function(done) {
      request(app)
        .get('/api/merchandisecodes/' + newMerchandisecode._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          merchandisecode = res.body;
          done();
        });
    });

    afterEach(function() {
      merchandisecode = {};
    });

    it('should respond with the requested merchandisecode', function() {
      merchandisecode.name.should.equal('New Merchandisecode');
      merchandisecode.info.should.equal('This is the brand new merchandisecode!!!');
    });

  });

  describe('PUT /api/merchandisecodes/:id', function() {
    var updatedMerchandisecode;

    beforeEach(function(done) {
      request(app)
        .put('/api/merchandisecodes/' + newMerchandisecode._id)
        .send({
          name: 'Updated Merchandisecode',
          info: 'This is the updated merchandisecode!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedMerchandisecode = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedMerchandisecode = {};
    });

    it('should respond with the updated merchandisecode', function() {
      updatedMerchandisecode.name.should.equal('Updated Merchandisecode');
      updatedMerchandisecode.info.should.equal('This is the updated merchandisecode!!!');
    });

  });

  describe('DELETE /api/merchandisecodes/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/merchandisecodes/' + newMerchandisecode._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when merchandisecode does not exist', function(done) {
      request(app)
        .delete('/api/merchandisecodes/' + newMerchandisecode._id)
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
