'use strict';

var express = require('express');
var controller = require('./employee.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.get('/accesscode/:accesscode', controller.validateAccess);
router.get('/devicelookup/:deviceid', controller.getUserByDeviceId);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;
