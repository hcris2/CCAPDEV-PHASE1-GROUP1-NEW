const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require('../models/User.js');

router.post('/', async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ error: 'Username already exists. Please choose a different username.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10); 
    const newUser = new User({ username, password: hashedPassword });
    
    await newUser.save();
    res.json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred during user registration' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(400).send("Invalid username");
    }

    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) {
      return res.status(400).send("Invalid password");
    }
  
    req.session.user = user;
    res.send({ message: "Logged in!", user: { username: user.username } });
  } catch (error) {
    res.status(500).send("Something went wrong");
  }
});

router.get('/is-authenticated', (req, res) => {
  if (req.session && req.session.user) {
    res.send({ authenticated: true, user: { username: req.session.user.username } });
  } else {
    res.send({ authenticated: false });
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send("An error occurred during logout");
    }
    res.clearCookie('accessToken'); 
    res.send({ message: "Logged out!" });
  });
});

module.exports = router;
