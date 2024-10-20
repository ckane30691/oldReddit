const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const validateLoginInput = require('../../../validation/login');
const keys = require('../../../config/keys');
mongoose.connect(keys.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

const User = require('../../../models/User');

exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  const { errors, isValid } = validateLoginInput(body);

  if (!isValid) {
    return {
      statusCode: 400,
      body: JSON.stringify(errors),
    };
  }

  const email = body.email;
  const password = body.password;
  const user = await User.findOne({ email });

  if (!user) {
    errors.email = 'User not found';
    return {
      statusCode: 404,
      body: JSON.stringify(errors),
    };
  }

  const isMatch = await bcrypt.compare(password, user.passwordDigest);
  if (isMatch) {
    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
    };

    const token = jsonwebtoken.sign(
      payload,
      keys.secretOrKey,
      { expiresIn: 3600 }
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        token: 'Bearer ' + token,
      }),
    };
  } else {
    errors.password = 'Incorrect password';
    return {
      statusCode: 400,
      body: JSON.stringify(errors),
    };
  }
};