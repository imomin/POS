'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var ItemSchema = new mongoose.Schema({
  posCode: String,
  posCodeFormat: String,
  posCodeModifier: Number,
  activeFlag: Boolean,
  merchandiseCode: String,
  regularSellPrice: Number,
  description: String,
  paymentSystemsProductCode: Number,
  sellingUnits: Number,
  pricingGroup: Number,
  quantityAllowedFlg: Boolean,
  quantityRequiredFlg: Boolean,
  discountableFlg: Boolean,
  foodStampableFlg: Boolean,
  itemID: String,
  priceRequiredFlg: Boolean
});

export default mongoose.model('Item', ItemSchema);
