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
var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var xml2js = require("xml2js");
var parser = new xml2js.Parser({explicitArray:false,attrkey:'$'});
var builder = new xml2js.Builder();

String.prototype.replaceAll = function (find, replace) {
    var str = this;
    return str.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
};

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

function generateXML(entity,items) {
  var jsonPayload ={'ItemMaintenance':{'TableAction':{'$':{'type':'update'}},'RecordAction':{'$':{'type':'addchange'}}}};
  var ittData = entity.toObject();
  delete ittData._id;
  delete ittData.__v;
  delete ittData.MerchandiseCodeDetails;
  // console.log(JSON.stringify(items));
  var invItems = JSON.parse(JSON.stringify(items));
  for (var i = 0; i < invItems.length; i++) {
    invItems[i].ITTData = ittData;
    delete invItems[i]._id;
    delete invItems[i].__v;
  };
  jsonPayload.ItemMaintenance.ITTDetail = invItems;
  var temp = JSON.stringify(jsonPayload).replaceAll('"@":','"$":');
  jsonPayload = JSON.parse(temp);
  // console.log(JSON.stringify(jsonPayload));
  var xml = builder.buildObject(jsonPayload);
  console.log("**********XML EXPORT************");
  console.log(xml);
  console.log("********************************");
}

function addItems(data) {
  return function(entity){
    if (entity) {
      var totalItems = [];
      var totalItemCount = 0;
      //delete all the records from the collection
      var deleteItems = data.removeItems ? data.removeItems :[];
      totalItemCount = deleteItems.length;
      for (var j = 0; j < deleteItems.length; j++) {
        deleteItems[j].RecordAction["@"].type = "delete";
        totalItems.push(deleteItems[j]);
        Item.findByIdAsync(deleteItems[j]._id).then(item => {
          if(item) {
            item.removeAsync();
          }
        });
      };
      totalItemCount = totalItemCount + data.items.length;
      var i = 0;
      (function loop(){
        if(i < data.items.length){
          var itemData = data.items[i];
          itemData.ITTData = mongoose.Types.ObjectId(entity._id);
          if(itemData._id !== undefined) {
            itemData.RecordAction["@"].type = "addchange";
              Item.findByIdAsync(itemData._id).then(
                doc => {
                  delete itemData._id;
                  var updated = _.merge(doc, itemData);
                  console.log(updated);
                  updated.saveAsync().spread(updated => {
                    totalItems.push(updated);
                    loop();
                  });
                }
              )
          }
          else {
            //Add all new records from the collection
            itemData.RecordAction["@"].type = "create";
            Item.createAsync(itemData).then(invItems => {
              totalItems.push(invItems);
              loop();
            })
          }
          i++;
        }
        else {
          generateXML(entity,totalItems);
        }
      }());
    };
    return entity
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
    .then(addItems(req.body))
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
    .then(addItems(req.body))
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
