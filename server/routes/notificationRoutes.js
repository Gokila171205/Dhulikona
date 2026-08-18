const express = require('express');
const router = express.Router();
const { 
  getNotifications, 
  markNotificationRead, 
  markAllRead 
} = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getNotifications);

router.route('/read-all')
  .patch(markAllRead);

router.route('/:id/read')
  .patch(markNotificationRead);

module.exports = router;
