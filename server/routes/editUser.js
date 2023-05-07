const express = require('express');
const router = express.Router();
const users = require('../models/Users');
const bcrypt = require('bcrypt');
const logCheck = require('../middlewares/logCheck');

router.post('/delete',logCheck, async (req,res) => {
    try{
        const userId = req.userId;
        const givenPassword= req.body.password
        const user = await users.findById(userId);
        if (!user) {
            res.status(410).json({ error: 'No user found' }); //410 no user found
            return;
        }
        const password = user.password;
        if (!givenPassword || !password) {
            res.status(500).json({ error: 'Invalid password or hash' }); //500 invalid password type
            return;
        }
        const match = await bcrypt.compare(givenPassword, password);
        if (match) {
            await users.findOneAndRemove({ _id: userId }, { new: true });
            res.status(205).json({ message: 'Successfully deleted'}); //205 successfully deleted account
        } else {
            res.status(300).json({ error: 'Wrong password' }); //300 wrong password
        }
    }catch(error){
        if (error.response.status === 401) {
            res.status(401).json({ message: 'Unauthorized' }); //401 unauthorized
        } else {
            res.status(500).json({ message: 'Internal server error' }); //500 internal server error
        }
    }
});

module.exports = router;