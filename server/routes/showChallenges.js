const express = require('express');
const router = express.Router();
const collection = require('../models/Challenges');

router.get('/',(req,res) => {
    console.log('processing...');
    collection.find().then(docs => {
        res.json(docs);
    }).catch(error => {
        console.error('error');
        res.status(500).json({error: 'Internal server error'});
    });
});

module.exports = router;