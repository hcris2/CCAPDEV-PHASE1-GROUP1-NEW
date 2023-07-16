const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  status: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  }
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
