'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var ThingSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean,
  admin:Boolean,
  code:String
});

export default mongoose.model('Thing', ThingSchema);
