const express = require('express');
const router = express.Router();
const users = require('../../models/Users');
const comments = require('../../models/Comments');
const challenges = require('../../models/Challenges');
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
            const user = await users.findOne({ _id: givenId });
            if (!user) {
                res.status(410).json({ error: 'No user found' }); //410 no user found
                return;
            }
            const challengesOfThatUser = await challenges.find({ $and: [{ author: user.login }, { challengeState: { $ne: 3 } }] }, null, {}).select('_id');
            const challengeIds = challengesOfThatUser.map(challenge => challenge._id);

            await comments.deleteMany({ challengeId: { $in: challengeIds } }); // Delete comments associated with challengeIds
            await challenges.deleteMany({ _id: { $in: challengeIds } }); // Delete challenges associated with user
            await users.findOneAndRemove({ _id: givenId }, { new: true }); // Finally, delete that user
            res.status(205).json({ message: 'Successfully deleted' }); //205 successfully deleted 
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
        const newLogin = req.body.login;
        const userId = req.body.id;
        const user = await users.findOne({ _id: userId });
        if (!user) {
            res.status(410).json({ error: 'No user found' }); //410 no user found
            return;
        }
        const userWithThatLogin = await users.findOne({ login: newLogin });
        if (!userWithThatLogin) {
            await users.findOneAndUpdate({ _id: userId }, { login: newLogin }, { new: true });
            res.status(205).json({ message: 'Successfully updated login' }); //205 successfully updated login
        }
        else {
            res.status(409).json({ error: 'Login is already occupied' }); //409 login is already occupied
            return;
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
        const adminId = req.adminId;
        const userId = req.body.id;
        const givenPassword = req.body.password;
        const admin = await users.findById(adminId);
        const adminPassword = admin.password;
        const match = await bcrypt.compare(givenPassword, adminPassword);
        if (match) {
            const user = await users.findOne({ _id: userId });
            if (!user) {
                res.status(410).json({ error: 'No user found' }); //410 no user found
                return;
            }
            if (user.isAdmin) {
                await users.findOneAndUpdate({ _id: userId }, { isAdmin: false }, { new: true });
            }
            else {
                await users.findOneAndUpdate({ _id: userId }, { isAdmin: true }, { new: true });
            }
            res.status(205).json({ message: 'Successfully changed status' }); //205 successfully changed status
        }
        else {
            res.status(300).json({ error: 'Wrong password' }); //300 wrong password
            return;
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

module.exports = router;