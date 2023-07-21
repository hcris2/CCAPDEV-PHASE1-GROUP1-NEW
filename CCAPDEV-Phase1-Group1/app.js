const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");

/* -------------------------------------------------------------------------------------- */
const app = express()
const router = express.Router();


mongoose.connect('mongodb://127.0.0.1/MCO1db')
    .then(() => console.log('Connected to DB'))

const User = require('./models/User.js')
const Task = require('./models/Task.js');

app.use(express.json())
app.use(express.urlencoded({extended:false}))

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

  // for logging in
app.post('/api/login', async (req, res) => {

   try{
    const check = await User.collection.findOne({username:req.body.username})
    if(check.password ===req.body.password){
      res.render("plan.html");
    }
    else{
      res.send("Invalid Credentials");
    }
   }catch{
    res.send("Wrong details");


   }
});

// for loading tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    console.error('An error occurred while retrieving tasks:', error);
    res.status(500).json({ error: 'An error occurred while retrieving tasks' });
  }
});


app.post('/api/tasks', async (req, res) => {
  try {
    // Extract the task data from the request body
    const { task_status, task_name, task_content, task_date, task_priority, task_category } = req.body;

    // Create a new task document
    const task = new Task({
      task_status,
      task_name,
      task_content,
      task_date,
      task_priority,
      task_category
    });

    // Save the task to the database
    await task.save();

    res.status(201).json(task); // Return the created task as the API response
  } catch (error) {
    console.error('An error occurred while adding the task:', error);
    res.status(500).json({ error: 'An error occurred while adding the task' });
  }
});
// for displaying tasks
app.get('/api/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching task details', error: error.message });
  }
});

// for updating tasks
// PUT route to update a task by id
app.patch('/api/tasks/:id', async (req, res) => {
  const taskId = req.params.id;
  const updatedTaskData = req.body;

  try {
    // Find the task by id and update it in the database
    const updatedTask = await Task.findByIdAndUpdate(taskId, updatedTaskData, {
      new: true, // Return the updated task
    });

    res.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'An error occurred while updating the task' });
  }
});

//for deleting tasks
app.delete('/api/tasks/:id', async (req, res) => {
  const taskId = req.params.id;

  try {
    // Find the task by id and delete it in the database
    const deletedTask = await Task.findByIdAndRemove(taskId);

    res.json(deletedTask);
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'An error occurred while deleting the task' });
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