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


function populateDepartment(){
  return function(entity){
    if (entity) {
      return entity.populateAsync('department')
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
    .then(populateDepartment())
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
    .then(populateDepartment())
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
  Item.findOneAsync({'items.posCode': {$eq: barcode}})
    .then(item => {
      if (!item) {
        return res.status(404).end();
      }
      item.populateAsync('department')
      .then(function(result){
        res.status(200).json(result);
      })
    })
    .catch(err => next(err));
}

// Gets a list of Merchandisecodes group by name and itemId
export function group(req, res) {
    Item.aggregateAsync([
        {$group:{"_id":{ItemID: "$ITTData.ItemID", Description: "$ITTData.Description"}}},
        {$sort:{"_id.Description":1}}
      ])
    .then(responseWithResult(res))
    .catch(handleError(res));
}

// Gets a list of Merchandisecodes by itemId
export function groupByItemId(req, res) {
  Item.findAsync({'ITTData.ItemID':req.params.itemid})
    .then(handleEntityNotFound(res))
    .then(data => {
      var itemData = [];
      var counter = 0;
      _.forEach(data, function(value, key){
        data[key].populateAsync('department')
        .then(extendedData => {
          itemData.push(extendedData);
          counter = counter + 1;
          if(counter === data.length){
            res.status(200).json(itemData);
          }
        })
        .catch(handleError(res));
        console.log(data[key]);
      })
    })
    //.then(responseWithResult(res))
    .catch(handleError(res));
}
