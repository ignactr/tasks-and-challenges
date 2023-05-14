const express = require('express');
const router = express.Router();
const comments = require('../models/Comments');
const challenges = require('../models/Challenges');
const logCheck = require('../middlewares/logCheck');

router.post('/claim',logCheck, async (req,res)=>{
    try {
        const challengeId = req.body.challengeId;
        const userLogin = req.body.userLogin;

        await challenges.findByIdAndUpdate(challengeId, {"acceptedBy": userLogin, challengeState: 1});
        res.status(202).json({ message: 'Challenge`s state updated' });

    } catch (error) {
        if (error.status === 401) {
            res.status(401).json({ message: 'Unauthorized' });
        }else {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
});
router.post('/unclaim',logCheck, async (req,res)=>{
    try {
        const challengeId = req.body.challengeId;

        await challenges.findByIdAndUpdate(challengeId, {"acceptedBy": null, challengeState: 0});
        res.status(200).json({ message: 'Challenge`s state updated' });

    } catch (error) {
        if (error.status === 401) {
            res.status(401).json({ message: 'Unauthorized' });
        }else {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
});
router.post('/cancel',logCheck, async (req,res)=>{
    try {
        const challengeId = req.body.challengeId;

        await challenges.findByIdAndUpdate(challengeId, {challengeState: 1});
        res.status(200).json({ message: 'Challenge`s state updated' });

    } catch (error) {
        if (error.status === 401) {
            res.status(401).json({ message: 'Unauthorized' });
        }else {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
});
router.post('/toVerification',logCheck, async (req,res)=>{
    try {
        const challengeId = req.body.challengeId;

        await challenges.findByIdAndUpdate(challengeId, {challengeState: 2});
        res.status(200).json({ message: 'Challenge`s state updated' });

    } catch (error) {
        if (error.status === 401) {
            res.status(401).json({ message: 'Unauthorized' });
        }else {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
});
router.post('/delete',logCheck, async (req,res)=>{
    try {
        const challengeId = req.body.challengeId;

        await challenges.findOneAndRemove({ _id: challengeId }, { new: true });
        await comments.deleteMany({ challengeId: challengeId });
        res.status(200).json({ message: 'Challenge`s state updated' });

    } catch (error) {
        if (error.status === 401) {
            res.status(401).json({ message: 'Unauthorized' });
        }else {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
});
router.post('/verify',logCheck, async (req,res)=>{
    try {
        const challengeId = req.body.challengeId;
        const option = req.body.option;
        var operation = 0;

        if(option === true){
            operation = 3;
        }
        else{
            operation = 1;
        }
        await challenges.findByIdAndUpdate(challengeId, {challengeState: operation});
        res.status(200).json({ message: 'Challenge`s state updated' });

    } catch (error) {
        if (error.status === 401) {
            res.status(401).json({ message: 'Unauthorized' });
        }else {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
});

module.exports = router;