var chokidar = require('chokidar');
var request = require('request');
var fs = require('fs');
var path = require('path');
var io = require('socket.io-client');
var storeSocket = io.connect('http://localhost:3005');
var storeId = "client1234";


var watcher = chokidar.watch('file, dir', {
  ignored: /[\/\\]\./, persistent: true
});


watcher
  .on('add', function(path) { log('File', path, 'has been added'); })
  .on('addDir', function(path) { log('Directory', path, 'has been added'); })
  .on('change', function(path) { log('File', path, 'has been changed'); })
  .on('unlink', function(path) { log('File', path, 'has been removed'); })
  .on('unlinkDir', function(path) { log('Directory', path, 'has been removed'); })
  .on('error', function(error) { log('Error happened', error); })
  .on('ready', function() { log('Initial scan complete. Ready for changes.'); })
  .on('raw', function(event, path, details) { log('Raw event info:', event, path, details); })
// Only needed if watching is `persistent: true`.
watcher.close();

chokidar.watch('./outBox', {ignored: /[\/\\]\./,ignoreInitial: true}).on('all', function(event, fpath) {
  if(event === 'add'){
    var filePath = path.resolve(__dirname, fpath);
    var fileName = path.basename(filePath);
    console.log(fileName);

    fs.lstat(filePath, function(err, stats){
      if (err) console.log(err);
      if(stats.isFile() && path.extname(filePath) === '.xml') {
        fs.readFile(filePath.toString(), 'utf8', function(err, fileData){
          var xmlPayload = fileData;
            // USE HTTP POST
            //makeHTTPPost(fileName,data);
            //USE SOCKET
            emitData(fileName,xmlPayload);
        });
      }
    });
  }
});


// Add a connect listener
storeSocket.on('connect', function() {
  console.log("socket connected. emit storeConnect");
  storeSocket.emit("storeConnect", {"storeId":storeId});
});

storeSocket.on('store joined', function(data) {
  console.log("joined the room.");
});

storeSocket.on('priceChanged', function(data) {
  console.log("received changes from server");
  console.log(data);
});


function makeHTTPPost(fileName,data){
  request({
      url: "http://localhost:3005",
      method: "POST",
      headers: {
          "content-type": "application/xml",
          "fileName":fileName
      },
      body: data
  }, function (error, response, body){
      //console.log(response);
  });
}

function emitData(fileName,data){
  storeSocket.emit('newTransaction', {
      room: storeId,
      fileName: fileName,
      data: data
    });
}