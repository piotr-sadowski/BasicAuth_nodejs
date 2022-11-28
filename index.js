// Requiring module. express is the framework
const express = require("express");
var path = require('path');

const app = express();

function authentication(req, res, next) {
	// initialy req.headers.authorization is undefined, so next() call back function return 401 error is returned
	// when user fill in user and pass (encrypted in base64)
	var authheader = req.headers.authorization;
	console.log(req.headers);

	if (!authheader) {
		var err = new Error('You are not authenticated!');
		res.setHeader('WWW-Authenticate', 'Basic');
		err.status = 401;
		return next(err)
	}

	// decrypt user & pass using base64 data format
	var auth = new Buffer.from(authheader.split(' ')[1],
	'base64').toString().split(':');
	var user = auth[0];
	var pass = auth[1];

	// check if the entered user & pass match, if yes, then call next() and display index.html in browser
	if (user == 'piotr' && pass == 'Test@123!') {

		// If Authorized user
		next();
	} else {
		var err = new Error('You are not authenticated!');
		res.setHeader('WWW-Authenticate', 'Basic');
		err.status = 401;
		return next(err);
	}

}

// First step is the authentication of the client
app.use(authentication)
// if authenticaiton is success, then go to public dir and load the html
app.use(express.static(path.join(__dirname, 'public')));

// Server setup, and listen on port 3000, and write message to log "Server is Running"
app.listen((3000), () => {
	console.log("Server is Running");
})
