/**
 * Ittdata model events
 */

'use strict';

import {EventEmitter} from 'events';
var Ittdata = require('./ittdata.model');
var IttdataEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
IttdataEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Ittdata.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    IttdataEvents.emit(event + ':' + doc._id, doc);
    IttdataEvents.emit(event, doc);
  }
}

export default IttdataEvents;
