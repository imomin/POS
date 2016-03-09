/**
 * Tax model events
 */

'use strict';

import {EventEmitter} from 'events';
var Tax = require('./tax.model');
var TaxEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
TaxEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Tax.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    TaxEvents.emit(event + ':' + doc._id, doc);
    TaxEvents.emit(event, doc);
  }
}

export default TaxEvents;
