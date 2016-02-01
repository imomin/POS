'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var EmployeeSchema = new mongoose.Schema({
  name: String,
  accessCode: Number,
  active: {
  	type:Boolean,
  	default:true
  },
  deviceId: String,
  dateCreated: {
  	type:Date, 
  	default:new Date()
  },
  role: {
    type: String,
    default: 'user'
  }
});

export default mongoose.model('Employee', EmployeeSchema);
