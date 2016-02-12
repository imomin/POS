'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var CounterSchema = new mongoose.Schema({
  _id: {type: String, required: true},
  seq: { type: Number, default: 0 }
});

export default mongoose.model('Counter', CounterSchema);
