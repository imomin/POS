'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var Schema = mongoose.Schema;
var counter = require('./../counter/counter.model');
var Promise = require('promise');
var fs = require('fs');
import config from '../../config/environment';

var ItemSchema = new mongoose.Schema({
  RecordAction: {"@":{"type":{type: String, default:"addchange"}}},
  ItemCode: {"POSCodeFormat":{"@":{
    format:String}},
    POSCode:String,
    posCodeModifier:{type:Number,default:0},
    InventoryItemID:Number},
    ITTData: {type:Schema.Types.ObjectId, ref: 'ITTData', required:true}
});

ItemSchema.methods = {
  getNextId(callback) {
    counter.findByIdAndUpdate({_id: 'inventoryItemID'}, {$inc: { seq: 1} }, function(error, counter)   {
      callback(error,counter);
  });
  }
}
export default mongoose.model('Item', ItemSchema);
