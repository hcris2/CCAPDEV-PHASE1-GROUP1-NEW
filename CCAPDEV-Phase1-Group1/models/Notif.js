const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


const notifSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true
    },
    body: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      required: true
    }
  });

const Notif = mongoose.model('notif', notifSchema);

module.exports = Notif;