var express = require('express');
var app = express();
var fs = require('fs');



app.get('/', function(req, res){
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
    fs.writeFile('./inBox/'+req.headers.filename, data, 'utf8', function(err){
    	if(err) {console.log(err)}
    });
});

app.listen('3005')
console.log('Magic happens on port 3005');
exports = module.exports = app;