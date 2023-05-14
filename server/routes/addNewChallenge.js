const express = require('express');
const router = express.Router();
const challenges = require('../models/Challenges');
const logCheck = require('../middlewares/logCheck');

router.post('/',logCheck,async (req, res) => {
    try {
        author = req.body.author;
        title = req.body.title;
        details = req.body.details;
        endDate = new Date(req.body.endDate).toISOString();
        points = req.body.points;
        const newChallenge = new challenges({
            author,
            title,
            details,
            endDate,
            points,
        });
        await newChallenge.save();
        res.status(201).json({ message: 'Challenge added' });
    } catch (error) {
        console.log(error);
        if (error.status === 401) {
          res.status(401).json({ message: 'Unauthorized' });
        } else {
          res.status(500).json({ message: 'Internal server error' });
        }
    }
});

module.exports = router;