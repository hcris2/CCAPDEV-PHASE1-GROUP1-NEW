const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  task_name: {
    type: String,
    required: true
  },
  task_details: {
    type: String,
    required: true
  },
  task_due_date: {
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

const Plan = mongoose.model('Plan', planSchema);
module.exports = Plan;