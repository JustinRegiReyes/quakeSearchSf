//Requirements
var express = require('express');
var app = express();
var path = require('path');

//port for server to listen to
var port = process.env.PORT || 3000;

//use a direct path to views
var views = path.join(process.cwd(), '/views/');

//serve js & css file
app.use("/static", express.static("public"));

app.get('/', function(req, res) {
	res.sendFile(process.cwd() + '/index.html');
});

app.listen(port, function() {
    console.log('Listening on port ' + port);
});