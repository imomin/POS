'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var EmployeeSchema = new mongoose.Schema({
  name: String,
  accessCode: Number,
  active: Boolean,
  deviceId: String,
  dateCreated: Date,
  role: {
    type: String,
    default: 'user'
  },
});

export default mongoose.model('Employee', EmployeeSchema);
