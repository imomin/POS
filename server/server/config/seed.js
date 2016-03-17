/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import Counter from '../api/counter/counter.model';

Counter.count({})
  .then(count => {
    if(!count){//if not data exists
      Counter.createAsync({
        _id: 'departmentMerchandiseCode',
        seq: 100
      }, {
        _id: 'itemID',
        seq: 1000
      }, {
        _id: 'inventoryItemID',
        seq: 10000
      })
      .then(() => {
        console.log('finished populating Counter');
      });
    }
  })
  .catch(err => next(err));