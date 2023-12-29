// routes/auth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
//const bodyParser = require("body-parser");
const app = express();
//app.use(bodyParser.json());
const bodyParser = require("body-parser")

app.use(bodyParser.urlencoded({ extended: true }));

const SecretKey ="2809a95eedde5863d8e8e3bea5205cd62d290b10a3769afee677b8754a4d05b7"

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { name, password } = req.body;
    const user = new User({ name, password });
    console.log(user);
    await user.save();

    // Create a token for the new user
    const token = jwt.sign({ userId: user._id }, SecretKey);
    res.status(201).json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Signin
router.post('/signin', async (req, res) => {
  try {
    const { name, password } = req.body;

    // Find the user by name
    const user = await User.findOne({ name });

    // If the user is not found or the password is incorrect, return an error
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create a token for the authenticated user
    const token = jwt.sign({ userId: user._id }, SecretKey);

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
