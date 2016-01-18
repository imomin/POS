var chokidar = require('chokidar');
var request = require('request');
var fs = require('fs');
var path = require('path');

var watcher = chokidar.watch('file, dir', {
  ignored: /[\/\\]\./, persistent: true
});

//var log = console.log.bind(console);

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

watcher.on('add', function(path, stats) {
  console.log("test 1 " + path);
  console.log("test 2 " + stats);
  if (stats) console.log('File', path, 'changed size to', stats.size);
});

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
              request({
                  url: "http://localhost:3005",
                  method: "POST",
                  headers: {
                      "content-type": "application/xml",  // <--Very important!!!
                      "fileName":fileName
                  },
                  body: xmlPayload
              }, function (error, response, body){
                  //console.log(response);
              });

        });
      }
    });
  }
});