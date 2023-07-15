const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

/* -------------------------------------------------------------------------------------- */
const app = express()

mongoose.connect('mongodb://127.0.0.1/MCO1db')
    .then(() => console.log('Connected to DB'))

const User = require('./models/User.js')

app.use(express.json())

// adding a user, for registering;
app.post('/api/users', async (req, res) => {
    try {
      const { username, password } = req.body;
  
      // Check if the username already exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(409).json({ error: 'Username already exists. Please choose a different username.' });
      }
  
      const newUser = new User({ username, password });
      await newUser.save();
      res.json(newUser);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred during user registration' });
    }
  });

/* -------------------------------------------------------------------------------------- */
app.get('/',  (req,res) => {
    const indexPath = path.join(__dirname, 'index.html');
    res.sendFile(indexPath);
})

// for INDEX.html 
app.get('/index.html',  (req,res) => {
    const indexPath = path.join(__dirname, 'index.html');
    res.sendFile(indexPath);
})
app.get('/styles/index_styles.css', (req, res) => {
    const cssPath = path.join(__dirname, 'styles', 'index_styles.css');
    res.sendFile(cssPath);
  });
  
app.get('/styles/bgtest.jpg', (req, res) => {
    const bgPath = path.join(__dirname, 'styles', 'bgtest.jpg');
    res.sendFile(bgPath);
  });

app.get('/javascript/index.js',  (req,res) => {
    const indexPath = path.join(__dirname, 'index.html');
    res.sendFile(indexPath);
})
 // ^^ for index.html

 // for REGISTER.html
 app.get('/register.html',  (req,res) => {
    const registerPath = path.join(__dirname, 'register.html');
    res.sendFile(registerPath);
})
app.get('/styles/register_styles.css', (req, res) => {
    const cssPath = path.join(__dirname, 'styles', 'register_styles.css');
    res.sendFile(cssPath);
  });

app.get('/javascript/user.js',  (req,res) => {
    const indexPath = path.join(__dirname, 'javascript', 'user.js');
    res.sendFile(indexPath);
})

app.get('/models/User.js',  (req,res) => {
    const indexPath = path.join(__dirname, 'models', 'User.js');
    res.sendFile(indexPath);
})
// ^^ for REGISTER.html

//for PLAN.html
app.get('/plan.html',  (req,res) => {
    const planPath = path.join(__dirname, 'plan.html');
    res.sendFile(planPath);
})
app.get('/styles/styles.css', (req, res) => {
    const cssPath = path.join(__dirname, 'styles', 'styles.css');
    res.sendFile(cssPath);
  });

app.get('/javascript/plan.js',  (req,res) => {
    const indexPath = path.join(__dirname, 'javascript', 'plan.js');
    res.sendFile(indexPath);
})
// ^^ for plan.html

//for task_page.html
app.get('/task_page.html',  (req,res) => {
    const taskPath = path.join(__dirname, 'task_page.html');
    res.sendFile(taskPath);
})
app.get('/styles/task_page_styles.css', (req, res) => {
    const cssPath = path.join(__dirname, 'styles', 'task_page_styles.css');
    res.sendFile(cssPath);
  });

app.get('/javascript/task_page.js',  (req,res) => {
    const indexPath = path.join(__dirname, 'javascript', 'task_page.js');
    res.sendFile(indexPath);
})
//^^ for task_page.html


app.listen(3000, () => {
     console.log('Hello Listening at http://localhost:3000')
})