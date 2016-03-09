'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var storeCtrlStub = {
  index: 'storeCtrl.index',
  show: 'storeCtrl.show',
  create: 'storeCtrl.create',
  update: 'storeCtrl.update',
  destroy: 'storeCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var storeIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './store.controller': storeCtrlStub
});

describe('Store API Router:', function() {

  it('should return an express router instance', function() {
    storeIndex.should.equal(routerStub);
  });

  describe('GET /api/store', function() {

    it('should route to store.controller.index', function() {
      routerStub.get
        .withArgs('/', 'storeCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/store/:id', function() {

    it('should route to store.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'storeCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/store', function() {

    it('should route to store.controller.create', function() {
      routerStub.post
        .withArgs('/', 'storeCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/store/:id', function() {

    it('should route to store.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'storeCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/store/:id', function() {

    it('should route to store.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'storeCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/store/:id', function() {

    it('should route to store.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'storeCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
