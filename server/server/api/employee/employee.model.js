'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var EmployeeSchema = new mongoose.Schema({
  name: String,
  accessCode: {type:Number},
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

EmployeeSchema.methods = {
  generateAccessCode() {
	return Math.floor(Math.random()*9000) + 1000;
  }
}
export default mongoose.model('Employee', EmployeeSchema);
