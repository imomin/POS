'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var DepartmentSchema = new mongoose.Schema({
  merchandiseCode:Number,
  merchandiseCodeDescription:String,
  paymentSystemsProductCode:Number,
  taxStrategyID:Number,
  foodStampableFlg:Boolean,
  discountableFlg:Boolean,
  departmentKeyAtPOS:Number,
  activeFlag:Boolean
});

export default mongoose.model('Department', DepartmentSchema);
