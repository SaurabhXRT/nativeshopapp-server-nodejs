// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const SecretKey ="2809a95eedde5863d8e8e3bea5205cd62d290b10a3769afee677b8754a4d05b7"

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
      throw new Error('No token provided');
    }
    console.log(token, "this is the token");
   // const decoded = jwt.verify(token, SecretKey); // Use your secret key

    const decoded = jwt.verify(token, SecretKey, (err, decoded) => {
  if (err) {
    console.error('Token verification error:', err.message);
    throw new Error('Invalid token');
  }
  return decoded;
});

    const user = await User.findOne({ _id: decoded.userId, 'tokens.token': token });
    console.log(user);

    if (!user) {
      console.log("user not found");
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: 'Please authenticate' });
  }
};

module.exports = authMiddleware;
