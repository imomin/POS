'use strict';

var app = require('../..');
import request from 'supertest';

var newDepartment;

describe('Department API:', function() {

  describe('GET /api/departments', function() {
    var departments;

    beforeEach(function(done) {
      request(app)
        .get('/api/departments')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          departments = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      departments.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/departments', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/departments')
        .send({
          name: 'New Department',
          info: 'This is the brand new department!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newDepartment = res.body;
          done();
        });
    });

    it('should respond with the newly created department', function() {
      newDepartment.name.should.equal('New Department');
      newDepartment.info.should.equal('This is the brand new department!!!');
    });

  });

  describe('GET /api/departments/:id', function() {
    var department;

    beforeEach(function(done) {
      request(app)
        .get('/api/departments/' + newDepartment._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          department = res.body;
          done();
        });
    });

    afterEach(function() {
      department = {};
    });

    it('should respond with the requested department', function() {
      department.name.should.equal('New Department');
      department.info.should.equal('This is the brand new department!!!');
    });

  });

  describe('PUT /api/departments/:id', function() {
    var updatedDepartment;

    beforeEach(function(done) {
      request(app)
        .put('/api/departments/' + newDepartment._id)
        .send({
          name: 'Updated Department',
          info: 'This is the updated department!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedDepartment = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedDepartment = {};
    });

    it('should respond with the updated department', function() {
      updatedDepartment.name.should.equal('Updated Department');
      updatedDepartment.info.should.equal('This is the updated department!!!');
    });

  });

  describe('DELETE /api/departments/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/departments/' + newDepartment._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when department does not exist', function(done) {
      request(app)
        .delete('/api/departments/' + newDepartment._id)
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
