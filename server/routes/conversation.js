const express = require('express');
const router = express.Router();
const comments = require('../models/Comments');
const challenges = require('../models/Challenges')
const bcrypt = require('bcrypt');
const logCheck = require('../middlewares/logCheck');

router.post('/add',logCheck,(req,res)=>{
    const challenge = req.body.id;
    const author = req.body.author;
    const text = req.body.text;

    const newUser = new users({
        login,
        password: encryptedPassword,
    });
});

module.exports = router;