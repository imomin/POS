'use strict';

var express = require('express');
var controller = require('./item.controller');

var router = express.Router();

router.get('/', controller.index);
//router.get('/group/', controller.group);
router.get('/:id', controller.show);
//router.get('/group/:itemid', controller.groupByItemId);
router.get('/lookup/:barcode', controller.lookup);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;
