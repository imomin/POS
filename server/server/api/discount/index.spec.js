'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var discountCtrlStub = {
  index: 'discountCtrl.index',
  show: 'discountCtrl.show',
  create: 'discountCtrl.create',
  update: 'discountCtrl.update',
  destroy: 'discountCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var discountIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './discount.controller': discountCtrlStub
});

describe('Discount API Router:', function() {

  it('should return an express router instance', function() {
    discountIndex.should.equal(routerStub);
  });

  describe('GET /api/discounts', function() {

    it('should route to discount.controller.index', function() {
      routerStub.get
        .withArgs('/', 'discountCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/discounts/:id', function() {

    it('should route to discount.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'discountCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/discounts', function() {

    it('should route to discount.controller.create', function() {
      routerStub.post
        .withArgs('/', 'discountCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/discounts/:id', function() {

    it('should route to discount.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'discountCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/discounts/:id', function() {

    it('should route to discount.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'discountCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/discounts/:id', function() {

    it('should route to discount.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'discountCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
