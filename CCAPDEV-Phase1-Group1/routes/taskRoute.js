const express = require('express');
const router = express.Router();
const Task = require('../models/Task.js');

router.use(express.json());
router.use(express.urlencoded({extended:false}))

// for loading tasks
router.get('/', async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  try {
    const tasks = await Task.find({ user_id: req.session.userId }); // Change 'user' to 'user_id'
    res.status(200).json(tasks);
  } catch (error) {
    console.error('An error occurred while retrieving tasks:', error);
    res.status(500).json({ error: 'An error occurred while retrieving tasks' });
  }
});


  
  
router.post('/', async (req, res) => {
  try {
    const { task_status, task_name, task_content, task_date, task_priority, task_category } = req.body;

    const task = new Task({
      user_id: req.session.userId, // Change 'user' to 'user_id'
      task_status,
      task_name,
      task_content,
      task_date,
      task_priority,
      task_category
    });

    await task.save();
    res.status(201).json(task); 
  } catch (error) {
    console.error('An error occurred while adding the task:', error);
    res.status(500).json({ error: 'An error occurred while adding the task' });
  }
});


  // for displaying tasks
router.get('/:id', async (req, res) => {
    try {
      const task = await Task.findById(req.params.id);
      res.json(task);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching task details', error: error.message });
    }
  });
  
  // for updating tasks
  // PUT route to update a task by id
  router.patch('/:id', async (req, res) => {
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
router.delete('/:id', async (req, res) => {
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

module.exports = router;
  