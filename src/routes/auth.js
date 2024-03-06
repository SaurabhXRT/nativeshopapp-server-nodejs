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
    const token = jwt.sign({ userId: user._id }, SecretKey);
    res.status(201).json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/signin', async (req, res) => {
  try {
    const { name, password } = req.body;
    const user = await User.findOne({ name });
    console.log('User:', user);
    if (!user) {
      console.log('User not found');
      const notuser = 'notuser';
      return res.status(401).json({notuser});
    }

    const isPasswordValid = await user.comparePassword(password);
    console.log('Is Password Valid:', isPasswordValid);

    if (!isPasswordValid) {
      console.log('Invalid credentials');
      const notpassword = 'notpassword';
      return res.status(401).json({ notpassword });
    }
    const token = jwt.sign({ userId: user._id }, SecretKey);
    console.log('Token:', token);

    res.status(201).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
