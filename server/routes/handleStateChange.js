const express = require('express');
const router = express.Router();
const challenges = require('../models/Challenges');
const logCheck = require('../middlewares/logCheck');

router.post('/claim',logCheck, async (req,res)=>{
    try {
        const challengeId = req.body.challengeId;
        const userLogin = req.body.userLogin;

        await challenges.findByIdAndUpdate(challengeId, {"acceptedBy": userLogin, challengeState: 1});
        res.status(202).json({ message: 'Challenge`s state updated' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;