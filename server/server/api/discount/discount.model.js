'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var DiscountSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean
});

export default mongoose.model('Discount', DiscountSchema);
