const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const session = require('express-session');
const cookieParser = require('cookie-parser'); // Import the cookie-parser middleware
const app = express()
const dotenv = require('dotenv');
const router = express.Router();

app.use(express.json())
app.use(express.urlencoded({extended:false}))

mongoose.connect('mongodb://127.0.0.1/MCO1db')
    .then(() => console.log('Connected to DB'))

dotenv.config();
app.use(session({
      secret: 'process.env.SESSION_SECRET',
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 60000 } // 1 minute
    }));

const User = require('./models/User.js')

const taskRoute = require('./routes/taskRoute.js');
const notifRoute = require('./routes/notifRoute.js');
const stylesRoute = require('./routes/stylesRoute.js');
const javascriptRoute = require('./routes/javascriptRoute.js');
const htmlRoute = require('./routes/htmlRoute.js');

app.use('/api/tasks', taskRoute);
app.use('/api/notifications', notifRoute);
app.use('/styles', stylesRoute);
app.use('/javascript', javascriptRoute);
app.use('/', htmlRoute);


// adding a user, for registering;
app.post('/api/users', async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ error: 'Username already exists. Please choose a different username.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
    const newUser = new User({ username, password: hashedPassword });
    
    await newUser.save();
    res.json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred during user registration' });
  }
});


  // for logging in
  app.post('/api/login', async (req, res) => {
    try {
      const user = await User.findOne({ username: req.body.username });
      if (!user) {
        return res.status(400).send("Invalid username");
      }
  
      const validPass = await bcrypt.compare(req.body.password, user.password);
      if (!validPass) {
        return res.status(400).send("Invalid password");
      }
  
      // Set the user session
      req.session.user = user;
      res.send({ message: "Logged in!", user: { username: user.username } });
    } catch (error) {
      res.status(500).send("Something went wrong");
    }
  });
  app.get('/api/is-authenticated', (req, res) => {
    if (req.session && req.session.user) {
      res.send({ authenticated: true, user: { username: req.session.user.username } });
    } else {
      res.send({ authenticated: false });
    }
  });



  app.get('/api/logout', (req, res) => {
    req.session.destroy(err => {
      if (err) {
        return res.status(500).send("An error occurred during logout");
      }
      res.clearCookie('accessToken'); // Clear the session cookie
      res.send({ message: "Logged out!" });
    });
  });
  

app.listen(3000, () => {
     console.log('Hello Listening at http://localhost:3000')
})