const express = require('express');
const router = express.Router();
const challenges = require('../models/Challenges');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/',authMiddleware, async (req, res) => {
    try {
      const tasks = await challenges.find();
      res.send(tasks);
    } catch (error) {
      console.log(error);
      if (error.response.status === 401) {
        res.status(401).json({ message: 'Unauthorized' });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  });

module.exports = router;