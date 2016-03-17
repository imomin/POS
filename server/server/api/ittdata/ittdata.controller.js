/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/ittdata              ->  index
 * POST    /api/ittdata              ->  create
 * GET     /api/ittdata/:id          ->  show
 * PUT     /api/ittdata/:id          ->  update
 * DELETE  /api/ittdata/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
var Ittdata = require('./ittdata.model');
var Item = require('./../item/item.model');

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

function responseWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function saveUpdates(updates) {
  return function(entity) {
    var updated = _.merge(entity, updates);
    return updated.saveAsync()
      .spread(updated => {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.removeAsync()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function populateMerchandiseCodeDetail(){
  return function(entity){
    if (entity) {
      return entity.populateAsync('MerchandiseCodeDetails')
    };
  }
}

function populateItemCodes(){
  return function(entity){
    if (entity) {
      return Item.findAsync({'ITTData':entity._id}).then(invItems => {
          entity.set('items',invItems, { strict: false });
          return entity;
      });
    };
  }
}

// Gets a list of Ittdatas
export function index(req, res) {
  Ittdata.findAsync()
    .then(responseWithResult(res))
    .catch(handleError(res));
}

// Gets a single Ittdata from the DB
export function show(req, res) {
  Ittdata.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(populateMerchandiseCodeDetail())
    .then(populateItemCodes())
    .then(responseWithResult(res))
    .catch(handleError(res));
}

// Creates a new Ittdata in the DB
export function create(req, res) {
  Ittdata.createAsync(req.body)
    .then(responseWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Ittdata in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Ittdata.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(responseWithResult(res))
    .catch(handleError(res));
}

// Deletes a Ittdata from the DB
export function destroy(req, res) {
  Ittdata.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
