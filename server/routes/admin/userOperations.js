const express = require('express');
const router = express.Router();
const users = require('../../models/Users');
const bcrypt = require('bcrypt');
const adminCheck = require('../../middlewares/adminCheck');

router.post('/delete', adminCheck, async (req, res) => {
    try {
        const adminId = req.adminId;
        const givenPassword = req.body.password;
        const givenId = req.body.id;
        const admin = await users.findById(adminId);
        const adminPassword = admin.password;
        const match = await bcrypt.compare(givenPassword, adminPassword);
        if (match) {
            await users.findOneAndRemove({ _id: givenId }, { new: true });
        } else {
            res.status(300).json({ error: 'Wrong password' }); //300 wrong password
        }
    } catch (error) {
        if (error.response.status === 401) {
            res.status(401).json({ message: 'Unauthorized' });
        }
        else if (error.response.status === 402) {
            res.status(402).json({ message: 'You are not an admin' });
        }
        else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
});
router.post('/changeLogin', adminCheck, async (req, res) => {
    try {

    } catch (error) {
        if (error.response.status === 401) {
            res.status(401).json({ message: 'Unauthorized' });
        }
        else if (error.response.status === 402) {
            res.status(402).json({ message: 'You are not an admin' });
        }
        else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
});
router.post('/editKarma', adminCheck, async (req, res) => {
    try {

    } catch (error) {
        if (error.response.status === 401) {
            res.status(401).json({ message: 'Unauthorized' });
        }
        else if (error.response.status === 402) {
            res.status(402).json({ message: 'You are not an admin' });
        }
        else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
});
router.post('/changeStatus', adminCheck, async (req, res) => {
    try {

    } catch (error) {
        if (error.response.status === 401) {
            res.status(401).json({ message: 'Unauthorized' });
        }
        else if (error.response.status === 402) {
            res.status(402).json({ message: 'You are not an admin' });
        }
        else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
});

module.exports = router;