var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');

var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'webapp',
	password : 'webapp',
	database : 'nodelogin'
});

var app = express();
//set view engine
app.set("view engine","jade")

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/login.html'));
});

app.post('/auth', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				response.redirect('/home');
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.get('/home', function(request, response) {
	if (request.session.loggedin) {
		//response.send('Welcome back, ' + request.session.username + '!');
		response.sendFile(path.join(__dirname + '/home.html'));
	} else {
		response.send('Please login to view this page!');
		response.end();
	}
	//response.end();
});

app.get('/marks', function(request, response) {
	// response.sendFile(path.join(__dirname + '/marks.html'));
	var username = request.session.username;
	// connection.query('SELECT * FROM marks where student_name=?',[username], function(error, results, fields) {
		connection.query('SELECT * FROM marks ', function(error, results, fields) {
    // if any error while executing above query, throw error
    if (error) throw error;
    // if there is no error, you have the result
    // iterate for all the rows in result
    // Object.keys(results).forEach(function(key) {
    //   var row = results[key];
    //   console.log(row.name);
    // });
	response.render('marks', { marklist: results });

  });
});

app.get('/fees', function(request, response) {
	response.sendFile(path.join(__dirname + '/fees.html'));
});

app.listen(3000);


