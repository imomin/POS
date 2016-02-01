'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var departmentCtrlStub = {
  index: 'departmentCtrl.index',
  show: 'departmentCtrl.show',
  create: 'departmentCtrl.create',
  update: 'departmentCtrl.update',
  destroy: 'departmentCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var departmentIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './department.controller': departmentCtrlStub
});

describe('Department API Router:', function() {

  it('should return an express router instance', function() {
    departmentIndex.should.equal(routerStub);
  });

  describe('GET /api/departments', function() {

    it('should route to department.controller.index', function() {
      routerStub.get
        .withArgs('/', 'departmentCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/departments/:id', function() {

    it('should route to department.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'departmentCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/departments', function() {

    it('should route to department.controller.create', function() {
      routerStub.post
        .withArgs('/', 'departmentCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/departments/:id', function() {

    it('should route to department.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'departmentCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/departments/:id', function() {

    it('should route to department.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'departmentCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/departments/:id', function() {

    it('should route to department.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'departmentCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
