const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

const PORT = process.env.PORT || 5000;

app.get('/api', (req, res) => {
	res.json({
		message: 'Welcome to the API'
	});
});

app.post('/api/posts', verifyToken, (req, res) => {
	// Verify token
	jwt.verify(req.token, 'secretkey', (err, authData) => {
		if (err) {
			res.sendStatus(403);
		} else {
			res.json({
				message: 'Post created...',
				authData
			});
		}
	});
});

app.post('/api/login', (req, res) => {
	// Mock user
	const user = {
		id: 1,
		name: 'cawis',
		email: 'cawis@test.com'
	};

	// If you want to expires time for token
	// jwt.sign(user, 'secretkey', { expiresIn: '30s' }, (err, token) => {
	// 	res.json({
	// 		token
	// 	});
	// });

	jwt.sign(user, 'secretkey', (err, token) => {
		res.json({
			token
		});
	});
});

// FORMAT OF TOKEN
// Authorization: Bearer <access_token>

// Verfiy Token
function verifyToken(req, res, next) {
	// Get auth header value
	const bearerHeader = req.headers['authorization'];
	// Check if bearer is undefined
	if (typeof bearerHeader !== 'undefined') {
		// Split at the space
		const bearer = bearerHeader.split(' ');
		// Get token from array
		const bearerToken = bearer[1];
		// Set the token
		req.token = bearerToken;
		// next mddleware
		next();
	} else {
		// Forbidden
		res.sendStatus(403);
	}
}

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
