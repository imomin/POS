/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/departments              ->  index
 * POST    /api/departments              ->  create
 * GET     /api/departments/:id          ->  show
 * PUT     /api/departments/:id          ->  update
 * DELETE  /api/departments/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
var Department = require('./department.model');

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

// Gets a list of Departments
export function index(req, res) {
  Department.findAsync()
    .then(responseWithResult(res))
    .catch(handleError(res));
}

// Gets a single Department from the DB
export function show(req, res) {
  Department.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(responseWithResult(res))
    .catch(handleError(res));
}


// Creates a new Department in the DB
export function create(req, res) {
  var newDepartment = new Department(req.body);
  newDepartment.getNextId(function(err, counter){
      newDepartment.merchandiseCode = counter.seq;
      Department.createAsync(newDepartment)
      .then(responseWithResult(res, 201))
      .catch(handleError(res));
  });
}

// Updates an existing Department in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Department.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(responseWithResult(res))
    .catch(handleError(res));
}

// Deletes a Department from the DB
export function destroy(req, res) {
  Department.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
