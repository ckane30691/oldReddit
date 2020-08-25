const mongoose = require('mongoose');
const express = require('express');
const app = express();
const db = require('./config/keys').mongoURI;
const port = process.env.PORT || 5000;

mongoose
	.connect(db)
	.then(() => console.log('Connected to MongoDB succesfully'))
	.catch((err) => console.log(err));

app.listen(port, () => console.log(`Server is running on port ${port}`));
