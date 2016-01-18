var express = require('express');  
var app = express();  
var server = require('http').createServer(app);  
var io = require('socket.io')(server);
var fs = require('fs');

app.get('/', function(req, res){
	updatePrice("client1234","TEST");
	res.send({});
	res.end();
});

app.post('/', function(req, res, next){
	var data = '';
    req.setEncoding('utf8');
    req.on('data', function(chunk) { 
        data += chunk;
    });
    req.on('end', function() {
        req.rawBody = data;
        next();
        res.status(200);
        res.send({});
		res.end();
    });
    // console.log(req.headers.filename);
    // console.log(data);
    createFile(req.headers.filename,data)
});

function updatePrice(storeId, data){
	io.in(storeId).emit('priceChanged', data);
}	

io.on('connection', function (socket) {
	console.log("socket connected.");
	socket.on('storeConnect',function(data) {
		console.log(data.storeId + " connected.");
		socket.join(data.storeId);
		io.in(data.storeId).emit('store joined', data);
	});

	socket.on('disconnect',function(data) {
		//socket.leave(data.room);
	});

	socket.on('newTransaction',function(data) {
		createFile(data.fileName,data.data)
		io.in(data.room).emit('trasactionCreated', data);
	});
});

function createFile(fileName,content){
	fs.writeFile('./inBox/'+fileName, content, 'utf8', function(err){
		if(err) {console.log(err)}
	});
}

server.listen(3005, function(){
	console.log('Magic happens on port 3005');
});
