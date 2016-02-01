'use strict';

var app = require('../..');
import request from 'supertest';

var newEmployee;

describe('Employee API:', function() {

  describe('GET /api/employees', function() {
    var employees;

    beforeEach(function(done) {
      request(app)
        .get('/api/employees')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          employees = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      employees.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/employees', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/employees')
        .send({
          name: 'New Employee',
          info: 'This is the brand new employee!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newEmployee = res.body;
          done();
        });
    });

    it('should respond with the newly created employee', function() {
      newEmployee.name.should.equal('New Employee');
      newEmployee.info.should.equal('This is the brand new employee!!!');
    });

  });

  describe('GET /api/employees/:id', function() {
    var employee;

    beforeEach(function(done) {
      request(app)
        .get('/api/employees/' + newEmployee._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          employee = res.body;
          done();
        });
    });

    afterEach(function() {
      employee = {};
    });

    it('should respond with the requested employee', function() {
      employee.name.should.equal('New Employee');
      employee.info.should.equal('This is the brand new employee!!!');
    });

  });

  describe('PUT /api/employees/:id', function() {
    var updatedEmployee;

    beforeEach(function(done) {
      request(app)
        .put('/api/employees/' + newEmployee._id)
        .send({
          name: 'Updated Employee',
          info: 'This is the updated employee!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedEmployee = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedEmployee = {};
    });

    it('should respond with the updated employee', function() {
      updatedEmployee.name.should.equal('Updated Employee');
      updatedEmployee.info.should.equal('This is the updated employee!!!');
    });

  });

  describe('DELETE /api/employees/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/employees/' + newEmployee._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when employee does not exist', function(done) {
      request(app)
        .delete('/api/employees/' + newEmployee._id)
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
