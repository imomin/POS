'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var merchandisecodeCtrlStub = {
  index: 'merchandisecodeCtrl.index',
  show: 'merchandisecodeCtrl.show',
  create: 'merchandisecodeCtrl.create',
  update: 'merchandisecodeCtrl.update',
  destroy: 'merchandisecodeCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var merchandisecodeIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './merchandisecode.controller': merchandisecodeCtrlStub
});

describe('Merchandisecode API Router:', function() {

  it('should return an express router instance', function() {
    merchandisecodeIndex.should.equal(routerStub);
  });

  describe('GET /api/merchandisecodes', function() {

    it('should route to merchandisecode.controller.index', function() {
      routerStub.get
        .withArgs('/', 'merchandisecodeCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/merchandisecodes/:id', function() {

    it('should route to merchandisecode.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'merchandisecodeCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/merchandisecodes', function() {

    it('should route to merchandisecode.controller.create', function() {
      routerStub.post
        .withArgs('/', 'merchandisecodeCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/merchandisecodes/:id', function() {

    it('should route to merchandisecode.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'merchandisecodeCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/merchandisecodes/:id', function() {

    it('should route to merchandisecode.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'merchandisecodeCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/merchandisecodes/:id', function() {

    it('should route to merchandisecode.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'merchandisecodeCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
