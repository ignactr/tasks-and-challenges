const express = require('express');
const router = express.Router();
const collection = require('../models/Challenges');

router.get('/', async (req, res) => {
    try {
      const tasks = await collection.find();
      res.send(tasks);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

module.exports = router;