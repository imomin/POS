/**
 * Main application routes
 */

'use strict';

import errors from './components/errors';
import path from 'path';

export default function(app) {
  // Insert routes below
  app.use('/api/ittdata', require('./api/ittdata'));
  app.use('/api/merchandisecodes', require('./api/merchandisecode'));
  app.use('/api/discounts', require('./api/discount'));
  app.use('/api/taxes', require('./api/tax'));
  app.use('/api/store', require('./api/store'));
  app.use('/api/counters', require('./api/counter'));
  app.use('/api/employees', require('./api/employee'));
  app.use('/api/items', require('./api/item'));
  app.use('/api/departments', require('./api/department'));
  app.use('/api/things', require('./api/thing'));
  app.use('/api/users', require('./api/user'));

  app.use('/auth', require('./auth'));
  app.use('/admin', require('./importTool'));

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get((req, res) => {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
}
