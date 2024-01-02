const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SecretKey ="2809a95eedde5863d8e8e3bea5205cd62d290b10a3769afee677b8754a4d05b7"

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
userSchema.methods.comparePassword = async function (password) {
  try {
    const isMatch = await bcrypt.compare(password, this.password);
    console.log('Password Comparison Result:', isMatch);

    return isMatch;
  } catch (error) {
    return false;
  }
};



userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ userId: user._id }, SecretKey); // Use your secret key
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};


module.exports = mongoose.model('User', userSchema);
