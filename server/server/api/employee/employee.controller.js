/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/employees              ->  index
 * POST    /api/employees              ->  create
 * GET     /api/employees/:id          ->  show
 * PUT     /api/employees/:id          ->  update
 * DELETE  /api/employees/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
var Employee = require('./employee.model');

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

// Gets a list of Employees
export function index(req, res) {
  Employee.findAsync()
    .then(responseWithResult(res))
    .catch(handleError(res));
}

// Gets a single Employee from the DB
export function show(req, res) {
  Employee.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(responseWithResult(res))
    .catch(handleError(res));
}

// Creates a new Employee in the DB
export function create(req, res) {
  var newEmployee = new Employee(req.body);
  if(!newEmployee.deviceId){
    newEmployee.accessCode = newEmployee.generateAccessCode();
  }
  Employee.createAsync(newEmployee)
    .then(responseWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Employee in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Employee.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(responseWithResult(res))
    .catch(handleError(res));
}

// Deletes a Employee from the DB
export function destroy(req, res) {
  Employee.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

/**
 *  Custom code
 */
export function validateAccess(req, res, next) {
  var deviceId = req.query.deviceId;
  var accessCode = req.params.accesscode;
  Employee.findOneAsync({ accessCode: accessCode })
    .then(employee => {
        if(!employee){
          return res.status(404).end();
        }
        employee.accessCode = null;
        employee.deviceId = deviceId;
        employee.saveAsync().then(() => {
          res.status(204).end();
        })
        .catch(handleError(res));
      })
    .catch(handleError(res));
}

export function getUserByDeviceId(req, res, next) {
  var deviceId = req.params.deviceid;
  Employee.findOneAsync({deviceId: deviceId})
    .then(employee => {
      if (!employee) {
        return res.status(401).end();
      }
      res.status(204).end();
    })
    .catch(err => next(err));
}

export function count(req, res, next) {
  var deviceId = req.params.deviceid;
  Employee.count({})
    .then(count => {
      console.log(count);
      if (!count) {
        return res.json({"count":0});
      }
      return res.json({"count":count});
    })
    .catch(err => next(err));
}
