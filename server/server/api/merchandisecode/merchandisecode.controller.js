/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/merchandisecodes              ->  index
 * POST    /api/merchandisecodes              ->  create
 * GET     /api/merchandisecodes/:id          ->  show
 * PUT     /api/merchandisecodes/:id          ->  update
 * DELETE  /api/merchandisecodes/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import config from './../../config/environment';
var Merchandisecode = require('./merchandisecode.model');
var xml2js = require("xml2js");
var parser = new xml2js.Parser({explicitArray:false,attrkey:'$'});
var builder = new xml2js.Builder();
var fs = require('bluebird').promisifyAll(require('fs'));

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

function generateXMLFile(action) {
  return function(entity) {
      return new Promise(function (resolve, reject) {
      var jsonPayload = {'MerchandiseCodeMaintenance':{'TableAction':{'$':{'type':'update'}},'RecordAction':{'$':{'type':'addchange'}}}};
      var mctData = entity.toObject();
      delete mctData._id;
      delete mctData.__v;
      delete mctData.MerchandiseCodeDetails;
      jsonPayload.MerchandiseCodeMaintenance.MCTDetail = mctData;
      var temp = JSON.stringify(jsonPayload).replaceAll('"@":','"$":');
      jsonPayload = JSON.parse(temp);
      var xml = builder.buildObject(jsonPayload);
      fs.appendFileAsync(config.xmlDistPath+'MCT_'+Math.floor(Math.random()*100000000)+'.xml', xml, 'utf8').then( res => {
        return resolve(entity);
      }).catch(err => {
        return reject(err);
      });
    });
  }
}

// Gets a list of Merchandisecodes
export function index(req, res) {
  Merchandisecode.findAsync()
    .then(responseWithResult(res))
    .catch(handleError(res));
}

// Gets a single Merchandisecode from the DB
export function show(req, res) {
  Merchandisecode.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(responseWithResult(res))
    .catch(handleError(res));
}

// Creates a new Merchandisecode in the DB
export function create(req, res) {
  var newMerchandisecode = new Merchandisecode(req.body);
  newMerchandisecode.getNextId(function(err, counter){
    newMerchandisecode.MerchandiseCode = counter.seq;
    Merchandisecode.createAsync(newMerchandisecode)
    .then(generateXMLFile('create'))
    .then(responseWithResult(res, 201))
    .catch(handleError(res));
  });
}

// Updates an existing Merchandisecode in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Merchandisecode.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(generateXMLFile('addchange'))
    .then(responseWithResult(res))
    .catch(handleError(res));
}

// Deletes a Merchandisecode from the DB
export function destroy(req, res) {
  Merchandisecode.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

String.prototype.replaceAll = function (find, replace) {
    var str = this;
    return str.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
};
