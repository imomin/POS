'use strict';

import express from 'express';
var multer  = require('multer');
var router = express.Router();
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname + '/../../../')
    },
    filename: function (req, file, cb) {
        cb(null, 'PassportDataMaintenance123.xml')
    }
});
var upload = multer({ storage: storage });


router.get('/example', function(req, res, next) {
	res.status(200).json({});
});


router.post('/upload', upload.single('file'), function(req, res, next){
	require('./importData').init().then(
		function(result){
		   res.status(200).json(result);
		},
		function(error){
		    res.status(500).json(error);
		}
	);
});


router.get('/export', function(req, res, next) {
	require('./exportData').init().then(
		function(result){
		   res.status(200).json(result);
		},
		function(error){
		    res.status(500).json(error);
		}
	);
});

export default router;