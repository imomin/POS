'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var taxCtrlStub = {
  index: 'taxCtrl.index',
  show: 'taxCtrl.show',
  create: 'taxCtrl.create',
  update: 'taxCtrl.update',
  destroy: 'taxCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var taxIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './tax.controller': taxCtrlStub
});

describe('Tax API Router:', function() {

  it('should return an express router instance', function() {
    taxIndex.should.equal(routerStub);
  });

  describe('GET /api/taxes', function() {

    it('should route to tax.controller.index', function() {
      routerStub.get
        .withArgs('/', 'taxCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/taxes/:id', function() {

    it('should route to tax.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'taxCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/taxes', function() {

    it('should route to tax.controller.create', function() {
      routerStub.post
        .withArgs('/', 'taxCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/taxes/:id', function() {

    it('should route to tax.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'taxCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/taxes/:id', function() {

    it('should route to tax.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'taxCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/taxes/:id', function() {

    it('should route to tax.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'taxCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
