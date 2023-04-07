const express = require('express');
const router = express.Router();
const users = require('../models/Users');
const bcrypt = require('bcrypt');

router.post('/', async (req, res) => {
    try {
      const givenLogin = req.body.login;
      const givenPassword = req.body.password;
      const user = await users.findOne({ login: givenLogin });
      if (!user) {
        res.status(410).json({ error: 'No user found' })
      }
      const password = user.password;
      if (typeof givenPassword !== 'string' || typeof password !== 'string') {
        res.status(500).json({ error: 'Invalid password or hash' });
        return;
      }
      const match = await bcrypt.compare(givenPassword, password);
      if (match) {
        res.status(200).json({ message: 'Successfully logged in' });
      } else {
        res.status(300).json({ error: 'Wrong password' });
      }
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

module.exports = router;