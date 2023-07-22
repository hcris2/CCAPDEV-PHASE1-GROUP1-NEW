const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


const categSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true
    }

  });

const Notif = mongoose.model('categ', categSchema);

module.exports = Notif;