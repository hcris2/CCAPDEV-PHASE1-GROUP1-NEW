const express = require('express');
const router = express.Router();


// get all notifications
router.get('/', async (req, res) => {
    try {
      const notifications = await Notif.find();
      res.json(notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

//get specific notification
router.get('/:notificationId', async (req, res) => {
    try{
      const notif = await Notif.findById(req.params.notificationId);
      res.json(notif);
    }
  
    catch(error){
      res.status(500).json({ error: 'Error' });
    }
  
  
  });
  
  
  // Add a new notification
router.post('/', async (req, res) => {
    try {
      
      const { title, body, date } = req.body;
      const newNotification = new Notif({
        title,
        body,
        date,
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