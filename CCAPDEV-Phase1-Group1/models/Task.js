const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  task_status: {
    type: String,
    required: true
  },
  task_name: {
    type: String,
    required: true
  },
  task_content: {
    type: String,
    required: true
  },
  task_date: {
    type: String,
    required: true
  },
  task_priority: {
    type: String,
    required: true
  },
  task_category: {
    type: String,
    required: true
  }
});

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;