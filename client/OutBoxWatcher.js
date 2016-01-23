"use strict";
var chokidar = require('chokidar');
var request = require('request');
var fs = require('fs');
var path = require('path');
var io = require('socket.io-client');
var _options = {
  storeId:null,
  serverURL:null,
  boOutBoxPath:null
}
var boOutBoxPath = "C:\\Passport\\XMLGateway\\BOOutBox\\";//directory to monitor;
var OutBoxWatcher = function(options) {
  //make sure it is initialize with all the propert arguments.
  if(options === undefined || options.storeId === undefined || options.storeId === null || options.storeId === ""){
    console.log("Store Id not set");
    return false;
  }
  if(options === undefined || options.serverURL === undefined || options.serverURL === null || options.serverURL === ""){
    console.log("Server URL not set");
    return false;
  }
  if(options === undefined || options.boOutBoxPath === undefined || options.boOutBoxPath === null || options.boOutBoxPath === ""){
    options.boOutBoxPath = "C:\\Passport\\XMLGateway\\BOOutBox\\";
    //ADD VALIDATION TO SEE IF DIECTORY IS ACCESS ABLE.
  }
  _options = options;
  console.log(_options.boOutBoxPath);
  fs.access(_options.boOutBoxPath, fs.R_OK, function (err) {//, fs.R_OK | fs.W_OK,
    if(err){
      console.log("Cannot access ", _options.boOutBoxPath);
    }
    return false;
  });
}

var _watcher;
var _isSocketConnected = false;// else fall back on http post
OutBoxWatcher.prototype.start = function(){

_watcher = chokidar.watch('file, dir', {
  ignored: /[\/\\]\./, 
  persistent: true
});

//Handle Socket Code
var storeSocket = io.connect(_options.serverURL);
// Add a connect listener
storeSocket.on('connect', function() {
  console.log("socket connected. emit storeConnect");
  _isSocketConnected = true;
  storeSocket.emit("storeConnect", {"storeId":_options.storeId});
});

storeSocket.on('store joined', function(data) {
  console.log("joined the room.");
});

storeSocket.on('priceChanged', function(data) {
  console.log("received changes from server");
  console.log(data);
});

var log = console.log.bind(console);
  _watcher
  .on('add', function(path) { log('File', path, 'has been added'); })
  .on('addDir', function(path) { log('Directory', path, 'has been added'); })
  .on('change', function(path) { log('File', path, 'has been changed'); })
  .on('unlink', function(path) { log('File', path, 'has been removed'); })
  .on('unlinkDir', function(path) { log('Directory', path, 'has been removed'); })
  .on('error', function(error) { log('Error happened', error); })
  .on('ready', function() { log('Initial scan complete. Ready for changes.'); })
  .on('raw', function(event, path, details) { log('Raw event info:', event, path, details); })

  chokidar.watch(_options.boOutBoxPath, {ignored: /[\/\\]\./,ignoreInitial: true}).on('all', function(event, fpath) {
    if(event === 'add'){
      var filePath = path.resolve(__dirname, fpath);
      var fileName = path.basename(filePath);
      console.log(fileName);

      fs.lstat(filePath, function(err, stats){
        if (err) console.log(err);
        if(stats.isFile() && path.extname(filePath) === '.xml') {
          fs.readFile(filePath.toString(), 'utf8', function(err, fileData){
            var xmlPayload = fileData;
            if(_isSocketConnected){//USE SOCKET
              storeSocket.emit('newTransaction', {
                room: _options.storeId,
                fileName: fileName,
                data: xmlPayload
              });
            }
            else {// USE HTTP POST
              request({
                  url: _options.serverURL,
                  method: "POST",
                  headers: {
                      "content-type": "application/xml",
                      "fileName":fileName
                  },
                  body: xmlPayload
              }, function (error, response, body){
                  //console.log(response);
              });
            }
          });
        }
      });
    }
  });
}

OutBoxWatcher.prototype.stop = function(){
  // Only needed if watching is `persistent: true`.
  if(typeof _watcher === 'object'){// only if the _watcher has been initialized.
    _watcher.close();
  }
}

module.exports = OutBoxWatcher;