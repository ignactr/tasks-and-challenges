const express = require('express');
const router = express.Router();
const challenges = require('../models/Challenges');
const logCheck = require('../middlewares/logCheck');

async function handleExpiry () {
  const tasks = await challenges.find();
  tasks.forEach(async (challenge) => {
    if(challenge.endDate < Date.now()){
      await challenges.findByIdAndUpdate(challenge._id, {challengeState: 4});
    }
  });
}

router.post('/',logCheck, async (req, res) => {
    try {
      const userId = req.userId
      handleExpiry();
      const tasks = await challenges.find();
      res.status(207).send({tasks,userId});
    } catch (error) {
      if (error.response.status === 401) {
        res.status(401).json({ message: 'Unauthorized' });
      } else {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  });

module.exports = router;