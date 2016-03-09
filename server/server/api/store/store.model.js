'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var StoreSchema = new mongoose.Schema({
  Date: String,
  Time: String,
  Store: {
  	Name:String
  },
  Passport: {
  	Version:String
  },
  ExtractionTool: {
	Version:String
  }
});

export default mongoose.model('Store', StoreSchema);