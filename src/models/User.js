const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Hash the password before saving
userSchema.pre('save', async function (next) {
  const user = this;

  try {
    if (user.isModified('password')) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      console.log('Hashed Password:', hashedPassword);

      user.password = hashedPassword;
    }
    next();
  } catch (error) {
    next(error);
  }
});

// Add a method to compare passwords during signin
userSchema.methods.comparePassword = async function (password) {
  try {
    const isMatch = await bcrypt.compare(password, this.password);
    console.log('Password Comparison Result:', isMatch);

    return isMatch;
  } catch (error) {
    return false;
  }
};

// models/User.js
// ... (your existing User model code)

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ userId: user._id }, 'your-secret-key'); // Use your secret key
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};


module.exports = mongoose.model('User', userSchema);
