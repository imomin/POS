/**
 * Discount model events
 */

'use strict';

import {EventEmitter} from 'events';
var Discount = require('./discount.model');
var DiscountEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
DiscountEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Discount.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    DiscountEvents.emit(event + ':' + doc._id, doc);
    DiscountEvents.emit(event, doc);
  }
}

export default DiscountEvents;
