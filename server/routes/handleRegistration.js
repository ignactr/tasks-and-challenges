const express = require('express');
const router = express.Router();
const users = require('../models/Users');
const bcrypt = require('bcrypt');

router.post('/', async (req,res)=>{
    try {
        const { login, password } = req.body;
        const saltValue = bcrypt.genSaltSync(10);
        const encryptedPassword = await bcrypt.hash(password,saltValue)

        const user = await users.findOne({ login });
        if (user) {
        return res.status(400).json({ error: 'User already exists' });
        }

        const newUser = new users({
            login,
            password: encryptedPassword,
          });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;