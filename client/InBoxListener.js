"use strict";
var express = require('express');  
var app = express();  
var server = require('http').createServer(app);  
//var io = require('socket.io')(server);
var fs = require('fs');


var _options = {};
var InBoxListener = function() {}

InBoxListener.prototype.start = function(){
	console.log("waiting for data");
	app.get('/', function(req, res){
		res.send({'localServer':'running'});
		res.end();
	});
	server.listen(3006, function(){
		console.log('Magic happens on port 3006');
	});
}

module.exports = new InBoxListener();