const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./config/keys').mongoURI;
const users = require('./routes/api/users');

const port = process.env.PORT || 5000;
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose
	.connect(db)
	.then(() => console.log('Connected to MongoDB succesfully'))
	.catch((err) => console.log(err));

app.use('/api/users', users);

app.listen(port, () => console.log(`Server is running on port ${port}`));
