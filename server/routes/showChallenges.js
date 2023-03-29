const express = require('express');
const router = express.Router();
const collection = require('../models/Challenges');

router.get('/', async (req,res) => {
    // console.log('processing...');
    // collection.find().then(challenges => {
    //     res.send(challenges);
    // }).catch(error => {
    //     console.log(error);
    //     res.status(500).json({error: 'Internal server error'});
    // });

    const tasks = await collection.find();
    res.send(tasks)
});

module.exports = router;