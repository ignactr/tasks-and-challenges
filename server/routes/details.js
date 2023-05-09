const express = require('express');
const router = express.Router();
const challenges = require('../models/Challenges');
const logCheck = require('../middlewares/logCheck');

router.post('/details',logCheck, async (req,res)=>{
    try{
        const idToGet = req.body.id;
        const challenge = await challenges.findById(idToGet);
        if (!challenge) {
            res.status(410).json({ error: 'No challenge found' }); //410 no user found
            return;
        }
        console.log(challenge);
        res.status(207).send(challenge);
    }catch(error){
        if (error.response.status === 401) {
            res.status(401).json({ message: 'Unauthorized' }); //401 unauthorized
        } else {
            res.status(500).json({ message: 'Internal server error' }); //500 internal server error
        }
    }
});

module.exports = router;