'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var ittdataCtrlStub = {
  index: 'ittdataCtrl.index',
  show: 'ittdataCtrl.show',
  create: 'ittdataCtrl.create',
  update: 'ittdataCtrl.update',
  destroy: 'ittdataCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var ittdataIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './ittdata.controller': ittdataCtrlStub
});

describe('Ittdata API Router:', function() {

  it('should return an express router instance', function() {
    ittdataIndex.should.equal(routerStub);
  });

  describe('GET /api/ittdata', function() {

    it('should route to ittdata.controller.index', function() {
      routerStub.get
        .withArgs('/', 'ittdataCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/ittdata/:id', function() {

    it('should route to ittdata.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'ittdataCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/ittdata', function() {

    it('should route to ittdata.controller.create', function() {
      routerStub.post
        .withArgs('/', 'ittdataCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/ittdata/:id', function() {

    it('should route to ittdata.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'ittdataCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/ittdata/:id', function() {

    it('should route to ittdata.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'ittdataCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/ittdata/:id', function() {

    it('should route to ittdata.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'ittdataCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
