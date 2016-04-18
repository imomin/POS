/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/items              ->  index
 * POST    /api/items              ->  create
 * GET     /api/items/:id          ->  show
 * PUT     /api/items/:id          ->  update
 * DELETE  /api/items/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
var Item = require('./item.model');
var ittData = require('./../ittdata/ittdata.model');

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


function populateITTData(){
  return function(entity){
    if (entity) {
      console.log('populate item.');
      console.log(entity.ITTData._id);
      return entity.populateAsync('ITTData')
    };
  }
}

function populateITTDataMerchandiseCodeDetail(){
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

function generateXMLFile(action) {
  return function(entity) {
    return entity.generateXMLFile(action, entity).then(entity => {
      return entity;
    });
  }
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
    entity.items = updates.items;//hack to keep the items came from api.
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

// Gets a list of Items
export function index(req, res) {
  Item.findAsync()
    .then(responseWithResult(res))
    .catch(handleError(res));
}

// Gets a single Item from the DB
export function show(req, res) {
  Item.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(populateITTData())
    .then(responseWithResult(res))
    .catch(handleError(res));
}

// Creates a new Item in the DB
export function create(req, res) {
  var newItem = new Item(req.body);
  newItem.getNextId(function(err, counter){
      newItem.itemID = counter.seq;
      Item.createAsync(newItem)
        .then(generateXMLFile('create'))
        .then(responseWithResult(res, 201))
        .catch(handleError(res));
      });
}

// Updates an existing Item in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Item.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(populateITTData())
    .then(generateXMLFile('addchange'))
    .then(responseWithResult(res))
    .catch(handleError(res));
}

// Deletes a Item from the DB
export function destroy(req, res) {
  Item.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(generateXMLFile('delete'))
    .then(removeEntity(res))
    .catch(handleError(res));
}

export function lookup(req, res) {
  var barcode = req.params.barcode;
  Item.findAsync({'ItemCode.POSCode':barcode})
      .then(item => {
        if (!item) {
          return res.status(404).end();
        }
        console.log(item);
        ittData.findAsync({'_id':{ $in :[item.ITTData]}})
        .then(handleEntityNotFound(res))
        .then(populateITTDataMerchandiseCodeDetail())
        .then(populateItemCodes())
        .then(responseWithResult(res))
        .catch(handleError(res));
    })
    .catch(handleError(res));
}