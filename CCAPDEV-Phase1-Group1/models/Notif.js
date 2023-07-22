const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


const notifSchema = new mongoose.Schema({
    category_name: {
      type: String,
      required: true
    },
    notification_title: {
      type: String,
      required: true
    },
    notification_body: {
      type: String,
      required: true
    },
    notification_date: {
      type: String,
      required: true
    }
  });

const Notif = mongoose.model('notif', notifSchema);

module.exports = Notif;