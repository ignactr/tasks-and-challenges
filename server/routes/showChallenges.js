const express = require('express');
const router = express.Router();
const challenges = require('../models/Challenges');

router.get('/', async (req, res) => {
    try {
      const tasks = await challenges.find();
      res.send(tasks);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

module.exports = router;