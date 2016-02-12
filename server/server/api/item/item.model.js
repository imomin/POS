'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var Schema = mongoose.Schema;
var counter = require('./../counter/counter.model');

var ItemSchema = new mongoose.Schema({
  itemID: {type:Number, unique: true, require: true}, // PLU implement this on Create {$inc: { itemID: 1} }
  items:[{posCode:{type:Number},posCodeFormat:{type:String},posCodeModifier:{type:Number,default: 0}}], //[{ posCode: String, posCodeFormat: String,  posCodeModifier: Number,}]
  activeFlag: {type:Boolean, default: true},
  merchandiseCode: {type:Number, require: true},
  regularSellPrice: {type:Number, require: true},
  description: {type:String, require: true},
  paymentSystemsProductCode: {type:Number, default: 400},
  sellingUnits: {type:Number, default: 1},
  pricingGroup: {type:Number, default: 0},
  quantityAllowedFlg: {type:Boolean, default: true},
  quantityRequiredFlg:  {type:Boolean, default: false},
  discountableFlg: {type:Boolean, default: true},
  foodStampableFlg: {type:Boolean, default: false},
  priceRequiredFlg: {type:Boolean, default: false},
  minimumCustomerAge: {type: Number, enum: [0, 1001, 1002]}, // none, 18+ = 1001, 21+ = 1002
  taxStrategyID: {type: Number, enum: [101, 99]}, //101=taxable, 99=non-taxable
  department: {type:Schema.Types.ObjectId, ref: 'Department', required:true}
});

ItemSchema.methods = {
  getNextId(callback) {
    counter.findByIdAndUpdate({_id: 'itemID'}, {$inc: { seq: 1} }, function(error, counter)   {
      callback(error,counter);
  });
  }
}
export default mongoose.model('Item', ItemSchema);
//{'id':1,'name':'20oz Soda','departmentId':'','unit':'','price':'','isTaxable':'','isFoodStampable':'','restriction':'','items':[{'barcode':'123123','barcodeFormat':''},{'barcode':'123123123','barcodeFormat':''},{'barcode':'32342342','barcodeFormat':''},{'barcode':'123123','barcodeFormat':''},{'barcode':'123123123','barcodeFormat':''},{'barcode':'32342342','barcodeFormat':''},{'barcode':'123123','barcodeFormat':''},{'barcode':'123123123','barcodeFormat':''},{'barcode':'32342342','barcodeFormat':''}]}
