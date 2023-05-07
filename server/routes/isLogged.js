const express = require('express');
const router = express.Router();
const challenges = require('../models/Challenges');
const logCheck = require('../middlewares/logCheck');

router.post('/',logCheck, async (req,res) => {
    try {
        res.status(200).json({message: 'authorized'})
    } catch(error){
        console.log(error);
        if (error.response.status === 401) {
            res.status(401).json({ message: 'Unauthorized' });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
});

module.exports = router;