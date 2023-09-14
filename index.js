const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const MONGODB_URI = 'mongodb://127.0.0.1:27017/hcs';

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
  });

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const User = mongoose.model('User', userSchema);

app.post('/login', (req, res) => {
  const { loginEmail, loginPassword } = req.body;

  User.findOne({ email: loginEmail, password: loginPassword })
    .then((user) => {
      if (user) {
        res.json({ success: true, user: { id: user._id, name: user.name } ,message:"Login Success!!"});
      } else {
        res.json({ success: false, message: 'Invalid credentials' });
      }
    })
    .catch((err) => {
      console.error('Error finding user:', err.message);
      res.json({ success: false, message: 'An error occurred' });
    });
});

app.post('/students', (req, res) => {
  const { name, email, password } = req.body;

  User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        res.json({ success: false, message: 'Email already registered' });
      } else {
        const newUser = new User({ name, email, password });
        newUser.save()
          .then((savedUser) => {
            res.json({ success: true, user: { id: savedUser._id, name } });
          })
          .catch((err) => {
            console.error('Error saving user:', err.message);
            res.json({ success: false, message: 'An error occurred' });
          });
      }
    })
    .catch((err) => {
      console.error('Error finding user:', err.message);
      res.json({ success: false, message: 'An error occurred' });
    });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
