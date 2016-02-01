'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var employeeCtrlStub = {
  index: 'employeeCtrl.index',
  show: 'employeeCtrl.show',
  create: 'employeeCtrl.create',
  update: 'employeeCtrl.update',
  destroy: 'employeeCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var employeeIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './employee.controller': employeeCtrlStub
});

describe('Employee API Router:', function() {

  it('should return an express router instance', function() {
    employeeIndex.should.equal(routerStub);
  });

  describe('GET /api/employees', function() {

    it('should route to employee.controller.index', function() {
      routerStub.get
        .withArgs('/', 'employeeCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/employees/:id', function() {

    it('should route to employee.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'employeeCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/employees', function() {

    it('should route to employee.controller.create', function() {
      routerStub.post
        .withArgs('/', 'employeeCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/employees/:id', function() {

    it('should route to employee.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'employeeCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/employees/:id', function() {

    it('should route to employee.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'employeeCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/employees/:id', function() {

    it('should route to employee.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'employeeCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
