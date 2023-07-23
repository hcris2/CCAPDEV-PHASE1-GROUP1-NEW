const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const app = express()
const router = express.Router();

app.use(express.json())
app.use(express.urlencoded({extended:false}))

mongoose.connect('mongodb://127.0.0.1/MCO1db')
    .then(() => console.log('Connected to DB'))

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
    try{
     const user = await User.findOne({username:req.body.username})
     if(!user){
         return res.status(400).send("Invalid username");
     }
     const validPass = await bcrypt.compare(req.body.password, user.password);
     if(!validPass) return res.status(400).send("Invalid password");
 
     res.send("Logged in!");
    } catch {
     res.status(500).send("Something went wrong");
    }
 });
 

app.listen(3000, () => {
     console.log('Hello Listening at http://localhost:3000')
})