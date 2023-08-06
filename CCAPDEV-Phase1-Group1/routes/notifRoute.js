const express = require('express');
const router = express.Router();
const Notif = require('../models/Notif.js');

router.use(express.json());
router.use(express.urlencoded({extended:false}))



// Fetch notifications based on userId
router.get('/', async (req, res) => {
  try {
    const userId = req.query.userId; // Assuming userId is passed as a query parameter
    const notifications = await Notif.find({ userId: userId });
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:notificationId', async (req, res) => {
  try{
    const notif = await Notif.findById(req.params.notificationId);
    res.json(notif);
  }

  catch(error){
    res.status(500).json({ error: 'Error' });
  }


});

// When creating a new notification, include userId
router.post('/', async (req, res) => {
  try {
    const { title, body, date, userId } = req.body;
    const newNotification = new Notif({
      title,
      body,
      date,
      userId
    });

    await newNotification.save();
    res.json(newNotification);
  } catch (error) {
    console.error('Error adding notification:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a notification by its ID
router.put('/:notificationId', async (req, res) => {
  const notificationId = req.params.notificationId;
  const { title, body, date } = req.body;
  try {
    const updatedNotification = await Notif.findByIdAndUpdate(
      notificationId,
      { title, body, date },
      { new: true } 
    );;

    if (!updatedNotification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json(updatedNotification);
  } catch (error) {
    console.error('Error updating notification:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a notification by its ID
router.delete('/:notificationId', async (req, res) => {
  const notificationId = req.params.notificationId;

  try {
    const deletedNotification = await Notif.findByIdAndRemove(notificationId);

    if (!deletedNotification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json(deletedNotification);
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;








