'use strict';

var app = require('../..');
import request from 'supertest';

var newIttdata;

describe('Ittdata API:', function() {

  describe('GET /api/ittdata', function() {
    var ittdatas;

    beforeEach(function(done) {
      request(app)
        .get('/api/ittdata')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          ittdatas = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      ittdatas.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/ittdata', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/ittdata')
        .send({
          name: 'New Ittdata',
          info: 'This is the brand new ittdata!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newIttdata = res.body;
          done();
        });
    });

    it('should respond with the newly created ittdata', function() {
      newIttdata.name.should.equal('New Ittdata');
      newIttdata.info.should.equal('This is the brand new ittdata!!!');
    });

  });

  describe('GET /api/ittdata/:id', function() {
    var ittdata;

    beforeEach(function(done) {
      request(app)
        .get('/api/ittdata/' + newIttdata._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          ittdata = res.body;
          done();
        });
    });

    afterEach(function() {
      ittdata = {};
    });

    it('should respond with the requested ittdata', function() {
      ittdata.name.should.equal('New Ittdata');
      ittdata.info.should.equal('This is the brand new ittdata!!!');
    });

  });

  describe('PUT /api/ittdata/:id', function() {
    var updatedIttdata;

    beforeEach(function(done) {
      request(app)
        .put('/api/ittdata/' + newIttdata._id)
        .send({
          name: 'Updated Ittdata',
          info: 'This is the updated ittdata!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedIttdata = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedIttdata = {};
    });

    it('should respond with the updated ittdata', function() {
      updatedIttdata.name.should.equal('Updated Ittdata');
      updatedIttdata.info.should.equal('This is the updated ittdata!!!');
    });

  });

  describe('DELETE /api/ittdata/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/ittdata/' + newIttdata._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when ittdata does not exist', function(done) {
      request(app)
        .delete('/api/ittdata/' + newIttdata._id)
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
