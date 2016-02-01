/**
 * Employee model events
 */

'use strict';

import {EventEmitter} from 'events';
var Employee = require('./employee.model');
var EmployeeEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
EmployeeEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Employee.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    EmployeeEvents.emit(event + ':' + doc._id, doc);
    EmployeeEvents.emit(event, doc);
  }
}

export default EmployeeEvents;
